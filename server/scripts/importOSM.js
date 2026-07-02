/**
 * importOSM.js — Download real Uttarakhand stays from OpenStreetMap (Overpass API)
 * and convert them to the PahadiStay homestay schema.
 *
 * Output (written to server/data/):
 *   - osm-uttarakhand.raw.json     full Overpass response (named elements)
 *   - homestays.osm.json           mapped to the app's homestay schema
 *   - homestays.osm.csv            spreadsheet-friendly export
 *
 * Data (c) OpenStreetMap contributors, ODbL. Attribution required.
 *
 * Run:  node scripts/importOSM.js
 */
const fs = require('fs')
const path = require('path')
const https = require('https')

const OUT_DIR = path.join(__dirname, '..', 'data')

// District centroids for nearest-match assignment
const DISTRICTS = {
  Uttarkashi: [30.73, 78.45], Chamoli: [30.40, 79.32], Rudraprayag: [30.28, 78.98],
  'Tehri Garhwal': [30.39, 78.48], Dehradun: [30.32, 78.03], 'Pauri Garhwal': [29.84, 78.78],
  Pithoragarh: [29.58, 80.22], Bageshwar: [29.84, 79.77], Almora: [29.59, 79.65],
  Champawat: [29.34, 80.09], Nainital: [29.39, 79.45], 'Udham Singh Nagar': [28.97, 79.40],
  Haridwar: [29.95, 78.16],
}
const LOCAL_IMAGES = [
  '/images/chopta-forest.jpg', '/images/kausani-peaks.jpg', '/images/nainital-lake.jpg',
  '/images/munsiyari.jpg', '/images/mountain-village.jpg', '/images/auli-snow.jpg',
  '/images/pangot-birds.jpg', '/images/valley-flowers.jpg',
]

function nearestDistrict(lat, lng) {
  let best = 'Dehradun', bestD = Infinity
  for (const [name, [dlat, dlng]] of Object.entries(DISTRICTS)) {
    const d = (lat - dlat) ** 2 + (lng - dlng) ** 2
    if (d < bestD) { bestD = d; best = name }
  }
  return best
}

const TYPE_MAP = {
  guest_house: ['Homestay', 1800, 'Nature Eco'],
  chalet:      ['Mountain Chalet', 2600, 'Adventure'],
  hostel:      ['Backpacker Hostel', 900, 'Adventure'],
  hotel:       ['Boutique Hotel', 3200, 'Nature Eco'],
  resort:      ['Resort', 4200, 'Nature Eco'],
}

function categorise(tags, district) {
  const name = (tags.name || '').toLowerCase()
  if (/temple|dham|kedar|badri|yamunotri|gangotri|mandir/.test(name)) return 'Char Dham'
  if (/forest|jungle|wild|tiger|corbett/.test(name)) return 'Wildlife'
  if (/camp|tent/.test(name)) return 'Camping'
  if (/trek|base|glacier/.test(name)) return 'Trekking'
  if (['Rudraprayag', 'Chamoli', 'Uttarkashi'].includes(district)) return 'Char Dham'
  return null
}

function overpass(query) {
  const data = 'data=' + encodeURIComponent(query)
  const options = {
    hostname: 'overpass-api.de', path: '/api/interpreter', method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data),
      'User-Agent': 'PahadiStay/1.0 (academic research)',
    },
  }
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', (c) => (body += c))
      res.on('end', () => {
        try { resolve(JSON.parse(body)) } catch (e) { reject(new Error('Bad JSON: ' + body.slice(0, 200))) }
      })
    })
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

function toCSV(rows) {
  const cols = ['_id', 'name', 'village', 'district', 'pricePerNight', 'propertyType', 'category', 'maxGuests', 'ownerContact', 'lat', 'lng']
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [cols.join(','), ...rows.map((r) => cols.map((c) =>
    esc(c === 'lat' ? r.geo.lat : c === 'lng' ? r.geo.lng : r[c])).join(','))].join('\n')
}

async function main() {
  const query = `[out:json][timeout:180];
    area["name"="Uttarakhand"]["admin_level"="4"]->.a;
    (
      node["tourism"~"guest_house|chalet|hostel|hotel|resort"](area.a);
      way["tourism"~"guest_house|chalet|hostel|hotel|resort"](area.a);
    );
    out center tags;`

  console.log('Querying OpenStreetMap Overpass for Uttarakhand stays...')
  const res = await overpass(query)
  const named = res.elements.filter((e) => e.tags && e.tags.name)
  console.log(`Received ${res.elements.length} elements, ${named.length} named.`)

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, 'osm-uttarakhand.raw.json'),
    JSON.stringify({ generated: new Date().toISOString(), license: 'ODbL - (c) OpenStreetMap contributors', elements: named }, null, 2))

  const homestays = named.map((e, i) => {
    const lat = e.lat ?? e.center?.lat
    const lng = e.lon ?? e.center?.lng ?? e.center?.lon
    const t = e.tags
    const district = t['addr:district'] || (lat != null ? nearestDistrict(lat, lng) : 'Dehradun')
    const [propertyType, basePrice, defCat] = TYPE_MAP[t.tourism] || ['Homestay', 1800, 'Nature Eco']
    const amenities = ['Home-cooked Meals', 'Hot Water']
    if (t.internet_access && t.internet_access !== 'no') amenities.push('Wi-Fi')
    if (t['parking'] || t['amenity'] === 'parking') amenities.push('Parking')
    const stars = Number(t.stars)
    return {
      _id: `osm-${e.id}`,
      name: t.name,
      village: t['addr:village'] || t['addr:city'] || t['addr:hamlet'] || district,
      district,
      state: 'Uttarakhand',
      pricePerNight: basePrice + ((e.id % 9) * 100),
      averageRating: Number.isFinite(stars) && stars > 0 ? Math.min(5, stars) : 0,
      totalReviews: 0,
      propertyType,
      amenities,
      maxGuests: 2 + (e.id % 5),
      description: `${t.name} is a ${propertyType.toLowerCase()} in ${district}, Uttarakhand. ` +
        `Imported from OpenStreetMap; details to be enriched by the host.`,
      imageUrls: [LOCAL_IMAGES[i % LOCAL_IMAGES.length]],
      ownerName: 'Local Host',
      ownerContact: t.phone || t['contact:phone'] || '',
      website: t.website || t['contact:website'] || '',
      available: true,
      geo: { lat, lng },
      category: categorise(t, district) || defCat,
      source: 'OpenStreetMap (ODbL)',
    }
  }).filter((h) => h.geo.lat != null && h.geo.lng != null)

  fs.writeFileSync(path.join(OUT_DIR, 'homestays.osm.json'), JSON.stringify(homestays, null, 2))
  fs.writeFileSync(path.join(OUT_DIR, 'homestays.osm.csv'), toCSV(homestays))

  // district distribution
  const byDistrict = {}
  homestays.forEach((h) => { byDistrict[h.district] = (byDistrict[h.district] || 0) + 1 })

  console.log(`\nMapped ${homestays.length} properties to homestay schema.`)
  console.log('By district:', JSON.stringify(byDistrict))
  console.log('With phone:', homestays.filter((h) => h.ownerContact).length)
  console.log('\nFiles written to server/data/:')
  console.log('  - osm-uttarakhand.raw.json')
  console.log('  - homestays.osm.json')
  console.log('  - homestays.osm.csv')
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1) })
