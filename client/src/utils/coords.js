// Approximate coordinates for Uttarakhand homestay villages & districts.
// Used for the detail-page map + weather when a homestay has no explicit geo.
export const VILLAGE_COORDS = {
  chopta: [30.4894, 79.1500], munsiyari: [30.0668, 80.2380], kanatal: [30.4100, 78.3300],
  lansdowne: [29.8377, 78.6820], kausani: [29.8400, 79.6000], pangot: [29.4200, 79.4000],
  auli: [30.5300, 79.5660], chakrata: [30.7000, 77.8667], rishikesh: [30.0869, 78.2676],
  mussoorie: [30.4599, 78.0664], nainital: [29.3919, 79.4542], almora: [29.5892, 79.6467],
}
export const DISTRICT_COORDS = {
  rudraprayag: [30.2844, 78.9810], pithoragarh: [29.5833, 80.2181], 'tehri garhwal': [30.3900, 78.4800],
  'pauri garhwal': [29.8400, 78.7800], bageshwar: [29.8370, 79.7710], nainital: [29.3919, 79.4542],
  chamoli: [30.4000, 79.3200], dehradun: [30.3165, 78.0322], uttarkashi: [30.7300, 78.4500],
  haridwar: [29.9457, 78.1642], champawat: [29.3360, 80.0910], 'udham singh nagar': [28.9750, 79.4000],
  almora: [29.5892, 79.6467],
}

export function coordsFor(homestay) {
  if (homestay?.geo?.lat != null && homestay?.geo?.lng != null) return [homestay.geo.lat, homestay.geo.lng]
  const v = VILLAGE_COORDS[(homestay?.village || '').toLowerCase()]
  if (v) return v
  const d = DISTRICT_COORDS[(homestay?.district || '').toLowerCase()]
  if (d) return d
  return [30.0668, 79.0193] // Uttarakhand centre
}
