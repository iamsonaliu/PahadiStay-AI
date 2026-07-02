"""
build_dataset.py
Aggregate the two provided review files into a robust PahadiStay homestay dataset.

Inputs (from Downloads):
  - Uttarakhand_HomeStay_Reviews.csv   (3,500 structured reviews)
  - project_data_500.xlsx              (500 scraped TripAdvisor-style reviews)

Output (server/data/):
  - uttarakhand.dataset.json   { homestays: [...app schema with embedded reviews...], reviews: [...flat...] }

One record per homestay: averageRating, totalReviews, category, embedded reviews are all computed.
"""
import json, os, re, hashlib, datetime
import pandas as pd

DOWNLOADS = os.path.expanduser(r"~\Downloads")
CSV = os.path.join(DOWNLOADS, "Uttarakhand_HomeStay_Reviews.csv")
XLSX = os.path.join(DOWNLOADS, "project_data_500.xlsx")
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "uttarakhand.dataset.json")

DISTRICTS = {"uttarkashi","chamoli","rudraprayag","tehri garhwal","dehradun","pauri garhwal",
             "pithoragarh","bageshwar","almora","champawat","nainital","udham singh nagar","haridwar"}

CITY_TO_DISTRICT = {
    "rishikesh":"Dehradun","mussoorie":"Dehradun","dhanaulti":"Tehri Garhwal","chakrata":"Dehradun",
    "nainital":"Nainital","mukteshwar":"Nainital","bhimtal":"Nainital","pangot":"Nainital","sattal":"Nainital",
    "ranikhet":"Almora","kasar devi":"Almora","binsar":"Almora","almora":"Almora",
    "kausani":"Bageshwar","bageshwar":"Bageshwar","chopta":"Rudraprayag","guptkashi":"Rudraprayag",
    "auli":"Chamoli","joshimath":"Chamoli","mana":"Chamoli","munsiyari":"Pithoragarh",
    "lansdowne":"Pauri Garhwal","pauri":"Pauri Garhwal","kanatal":"Tehri Garhwal","tehri":"Tehri Garhwal",
    "harsil":"Uttarkashi","uttarkashi":"Uttarkashi","champawat":"Champawat","haridwar":"Haridwar",
}

COORDS = {  # city/district -> [lat, lng]
    "rishikesh":[30.0869,78.2676],"mussoorie":[30.4599,78.0664],"dhanaulti":[30.4220,78.2420],
    "nainital":[29.3919,79.4542],"mukteshwar":[29.4731,79.6492],"bhimtal":[29.3450,79.5610],
    "pangot":[29.4200,79.4000],"ranikhet":[29.6434,79.4322],"binsar":[29.6960,79.7460],
    "kausani":[29.8400,79.6000],"chopta":[30.4894,79.1500],"auli":[30.5300,79.5660],
    "joshimath":[30.5550,79.5640],"munsiyari":[30.0668,80.2380],"lansdowne":[29.8377,78.6820],
    "kanatal":[30.4100,78.3300],"harsil":[31.0330,78.7410],"almora":[29.5892,79.6467],
    "uttarkashi":[30.7300,78.4500],"chamoli":[30.4000,79.3200],"rudraprayag":[30.2844,78.9810],
    "tehri garhwal":[30.3900,78.4800],"dehradun":[30.3165,78.0322],"pauri garhwal":[29.8400,78.7800],
    "pithoragarh":[29.5833,80.2181],"bageshwar":[29.8370,79.7710],"champawat":[29.3360,80.0910],
    "udham singh nagar":[28.9750,79.4000],"haridwar":[29.9457,78.1642],
}

LOCAL_IMAGES = ["/images/chopta-forest.jpg","/images/kausani-peaks.jpg","/images/nainital-lake.jpg",
                "/images/munsiyari.jpg","/images/mountain-village.jpg","/images/auli-snow.jpg",
                "/images/pangot-birds.jpg","/images/valley-flowers.jpg","/images/temple-kedarnath.jpg"]

TOPIC_TO_CATEGORY = {
    "trekking":"Trekking","eco tourism":"Nature Eco","scenic beauty":"Nature Eco","nature":"Nature Eco",
    "wildlife":"Wildlife","bird":"Bird Watching","spiritual":"Char Dham","temple":"Char Dham",
    "adventure":"Adventure","camping":"Camping","food":"Nature Eco","hospitality":"Nature Eco",
}
CHAR_DHAM_DISTRICTS = {"rudraprayag","chamoli","uttarkashi"}

def category_for(name, city, district, topics):
    n, c, d = name.lower(), city.lower(), district.lower()
    # 1) name keywords
    if any(k in n for k in ("camp","tent")): return "Camping"
    if any(k in n for k in ("forest","jungle","wild","tiger","corbett")): return "Wildlife"
    if any(k in n for k in ("zostel","hostel","backpack","raft","adventure")): return "Adventure"
    if any(k in n for k in ("bird","nest")): return "Bird Watching"
    # 2) dominant review topic
    if topics:
        top = max(set(topics), key=topics.count).lower()
        if "trek" in top: return "Trekking"
    # 3) city / district context
    if "rishikesh" in c: return "Adventure"
    if "pangot" in c or "sattal" in c: return "Bird Watching"
    if any(k in c for k in ("auli","munsiyari","chopta","harsil","joshimath")): return "Trekking"
    if d in CHAR_DHAM_DISTRICTS: return "Char Dham"
    if any(k in c for k in ("kanatal","dhanaulti")): return "Camping"
    if "mussoorie" in c or "nainital" in c or "almora" in c: return "Nature Eco"
    return "Nature Eco"

AMENITY_DEFAULTS = ["Home-cooked Meals","Hot Water","Bonfire","Wi-Fi"]

def h(s):  # deterministic int from string
    return int(hashlib.md5(s.encode()).hexdigest(), 16)

def norm(s):
    return re.sub(r"\s+", " ", str(s or "").strip())

def resolve_district(raw_district, raw_city):
    d = norm(raw_district).lower()
    c = norm(raw_city).lower()
    if d in DISTRICTS: return norm(raw_district).title().replace("Garhwal","Garhwal")
    if c in CITY_TO_DISTRICT: return CITY_TO_DISTRICT[c]
    if d in CITY_TO_DISTRICT: return CITY_TO_DISTRICT[d]
    return "Dehradun"

def coords_for(city, district):
    for key in (norm(city).lower(), norm(district).lower()):
        if key in COORDS: return COORDS[key]
    return [30.0668, 79.0193]

def parse_date(v):
    s = norm(v)
    if re.match(r"\d{4}-\d{2}-\d{2}", s): return s[:10]
    try:
        return datetime.datetime.strptime(s, "%b %Y").strftime("%Y-%m-01")
    except Exception:
        return "2024-06-01"

def property_type(name):
    n = name.lower()
    if "zostel" in n or "hostel" in n or "backpack" in n: return "Backpacker Hostel"
    if "resort" in n: return "Resort"
    if "villa" in n: return "Mountain Villa"
    if "cottage" in n: return "Forest Cottage"
    if "camp" in n: return "Riverside Camp"
    if "retreat" in n: return "Eco Retreat"
    return "Eco-Homestay"

def price_for(ptype, name):
    base = {"Backpacker Hostel":950,"Resort":3800,"Mountain Villa":3600,"Forest Cottage":2200,
            "Riverside Camp":1600,"Eco Retreat":2400,"Eco-Homestay":1900}.get(ptype,1900)
    return base + (h(name) % 7) * 100

# ---- collect normalized reviews ----
records = []  # {name, district, city, rating, text, date, sentiment, topic, reviewer}

df = pd.read_csv(CSV)
for _, r in df.iterrows():
    name = norm(r.get("homestay_name"))
    if not name: continue
    district = resolve_district(r.get("district"), r.get("district"))
    records.append({
        "name": name, "district": district, "city": norm(r.get("district")),
        "rating": float(r.get("rating") or 0), "text": norm(r.get("review_text")),
        "date": parse_date(r.get("review_date")), "sentiment": norm(r.get("sentiment")),
        "topic": norm(r.get("review_topic")), "reviewer": norm(r.get("guest_type")) or "Guest",
        "channel": norm(r.get("booking_channel")),
    })

xl = pd.read_excel(XLSX, sheet_name="Review Data")
for _, r in xl.iterrows():
    name = norm(r.get("Homestay Name"))
    if not name: continue
    city = norm(r.get("Location"))
    district = resolve_district(city, city)
    records.append({
        "name": name, "district": district, "city": city,
        "rating": float(r.get("\u2b50 Rating") or r.get("Rating") or 0),
        "text": norm(r.get("Review Text")), "date": parse_date(r.get("Review Date")),
        "sentiment": norm(r.get("Sentiment")), "topic": norm(r.get("Primary Theme")),
        "reviewer": norm(r.get("Reviewer Type")) or "Guest", "channel": norm(r.get("Platform")),
    })

# ---- group into homestays ----
groups = {}
for rec in records:
    key = rec["name"].lower()
    groups.setdefault(key, []).append(rec)

homestays, flat_reviews = [], []
rev_counter = 0
for i, (key, revs) in enumerate(sorted(groups.items())):
    name = revs[0]["name"]
    district = revs[0]["district"]
    city = next((r["city"] for r in revs if r["city"]), district)
    ratings = [r["rating"] for r in revs if r["rating"] > 0]
    avg = round(sum(ratings)/len(ratings), 1) if ratings else 0
    # dominant topic -> category
    topics = [r["topic"].lower() for r in revs if r["topic"]]
    cat = category_for(name, city, district, topics)
    ptype = property_type(name)
    hid = f"h{1000 + i}"
    lat, lng = coords_for(city, district)
    top_themes = list(dict.fromkeys([r["topic"] for r in revs if r["topic"]]))[:3]
    desc = (f"{name} is a {ptype.lower()} in {city.title()}, {district}, Uttarakhand. "
            f"Guests frequently mention {', '.join(top_themes).lower() or 'warm hospitality'}. "
            f"A commission-free Pahadi stay with home-cooked meals and mountain views.")
    homestays.append({
        "_id": hid, "name": name, "village": city.title(), "district": district, "state": "Uttarakhand",
        "pricePerNight": price_for(ptype, name), "averageRating": avg, "totalReviews": len(revs),
        "propertyType": ptype, "category": cat, "amenities": AMENITY_DEFAULTS,
        "maxGuests": 2 + (h(name) % 5), "description": desc,
        "imageUrls": [LOCAL_IMAGES[i % len(LOCAL_IMAGES)]],
        "ownerName": "PahadiStay Host", "ownerContact": "", "available": True,
        "geo": {"lat": lat, "lng": lng}, "category_source": "review-derived",
        "source": "Aggregated guest-review dataset (Uttarakhand)",
    })
    # embed up to 8 reviews
    for rev in sorted(revs, key=lambda x: x["date"], reverse=True)[:8]:
        if not rev["text"]: continue
        rev_counter += 1
        flat_reviews.append({
            "_id": f"gr{rev_counter}", "homestayId": hid,
            "guestName": f"{rev['reviewer']} guest".strip().title(),
            "rating": int(round(rev["rating"])) or 4, "comment": rev["text"],
            "date": rev["date"], "sentiment": rev["sentiment"], "topic": rev["topic"],
        })

out = {"generated": datetime.datetime.now().isoformat(),
       "note": "Aggregated from Uttarakhand_HomeStay_Reviews.csv + project_data_500.xlsx",
       "homestays": homestays, "reviews": flat_reviews}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print(f"Homestays: {len(homestays)} | Reviews embedded: {len(flat_reviews)} | Source reviews: {len(records)}")
from collections import Counter
print("By district:", dict(Counter(h['district'] for h in homestays)))
print("By category:", dict(Counter(h['category'] for h in homestays)))
print("Written to:", os.path.normpath(OUT))
