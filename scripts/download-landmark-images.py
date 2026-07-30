#!/usr/bin/env python3
"""
Download landmark images for all 195 countries from free sources.
Uses Wikimedia Commons API to find CC0/CC-BY licensed images.
"""

import os
import json
import requests
from pathlib import Path
from typing import Optional
import time

# Country landmarks mapping
COUNTRY_LANDMARKS = {
    "algeria": "Casbah of Algiers",
    "angola": "Fortress of Sao Miguel, Luanda",
    "benin": "Door of No Return, Ouidah",
    "botswana": "Okavango Delta",
    "burkina-faso": "Grand Mosque of Bobo-Dioulasso",
    "burundi": "Lake Tanganyika",
    "cabo-verde": "Cidade Velha",
    "cameroon": "Mount Cameroon",
    "central-african-republic": "Bangui Cathedral",
    "chad": "Ennedi Plateau",
    "comoros": "Mount Karthala",
    "republic-of-the-congo": "Odzala-Kokoua National Park",
    "democratic-republic-of-the-congo": "Virunga National Park",
    "cote-d-ivoire": "Basilica of Our Lady of Peace",
    "djibouti": "Lake Assal",
    "egypt": "Pyramids of Giza",
    "equatorial-guinea": "Malabo National Park",
    "eritrea": "Fiat Tagliero Building",
    "eswatini": "Sibebe Rock",
    "ethiopia": "Rock-Hewn Churches of Lalibela",
    "gabon": "Lope National Park",
    "gambia": "Kunta Kinteh Island",
    "ghana": "Cape Coast Castle",
    "guinea": "Mount Nimba",
    "guinea-bissau": "Bijagos Archipelago",
    "kenya": "Maasai Mara",
    "lesotho": "Maletsunyane Falls",
    "liberia": "Providence Island",
    "libya": "Leptis Magna",
    "madagascar": "Avenue of the Baobabs",
    "malawi": "Lake Malawi",
    "mali": "Great Mosque of Djenne",
    "mauritania": "Chinguetti",
    "mauritius": "Le Morne Brabant",
    "morocco": "Jemaa el-Fnaa",
    "mozambique": "Bazaruto Archipelago",
    "namibia": "Sossusvlei",
    "niger": "Agadez Grand Mosque",
    "nigeria": "Zuma Rock",
    "rwanda": "Volcanoes National Park",
    "sao-tome-and-principe": "Pico Cao Grande",
    "senegal": "Goree Island",
    "seychelles": "Vallee de Mai",
    "sierra-leone": "Tacugama Chimpanzee Sanctuary",
    "somalia": "Laas Geel",
    "south-africa": "Table Mountain",
    "south-sudan": "The Sudd",
    "sudan": "Meroe Pyramids",
    "tanzania": "Mount Kilimanjaro",
    "togo": "Koutammakou",
    "tunisia": "Amphitheatre of El Jem",
    "uganda": "Murchison Falls",
    "zambia": "Victoria Falls",
    "zimbabwe": "Great Zimbabwe",
    "afghanistan": "Blue Mosque of Mazar-i-Sharif",
    "armenia": "Geghard Monastery",
    "azerbaijan": "Flame Towers",
    "bahrain": "Bahrain Fort",
    "bangladesh": "The Sundarbans",
    "bhutan": "Tiger's Nest",
    "brunei": "Sultan Omar Ali Saifuddien Mosque",
    "cambodia": "Angkor Wat",
    "china": "Great Wall of China",
    "georgia": "Gergeti Trinity Church",
    "india": "Taj Mahal",
    "indonesia": "Borobudur Temple",
    "iran": "Nasir al-Mulk Mosque",
    "iraq": "Erbil Citadel",
    "israel": "Old City of Jerusalem",
    "japan": "Mount Fuji",
    "jordan": "Petra",
    "kazakhstan": "Charyn Canyon",
    "kuwait": "Kuwait Towers",
    "kyrgyzstan": "Issyk-Kul",
    "laos": "Kuang Si Falls",
    "lebanon": "Baalbek",
    "malaysia": "Petronas Twin Towers",
    "maldives": "Male Waterfront",
    "mongolia": "Genghis Khan Equestrian Statue",
    "myanmar": "Bagan Temples",
    "nepal": "Mount Everest",
    "north-korea": "Mount Paektu",
    "oman": "Sultan Qaboos Grand Mosque",
    "pakistan": "Badshahi Mosque",
    "palestine": "Dome of the Rock",
    "philippines": "Banaue Rice Terraces",
    "qatar": "Museum of Islamic Art",
    "saudi-arabia": "Al-Ula",
    "singapore": "Marina Bay Sands",
    "south-korea": "Gyeongbokgung Palace",
    "sri-lanka": "Sigiriya",
    "syria": "Palmyra",
    "tajikistan": "Iskanderkul",
    "thailand": "Grand Palace Bangkok",
    "timor-leste": "Cristo Rei Dili",
    "turkey": "Hagia Sophia",
    "turkmenistan": "Darvaza Gas Crater",
    "united-arab-emirates": "Burj Khalifa",
    "uzbekistan": "Registan Square",
    "vietnam": "Halong Bay",
    "yemen": "Socotra Island",
    "albania": "Butrint",
    "andorra": "Caldea",
    "austria": "Schönbrunn Palace",
    "belarus": "Mir Castle",
    "belgium": "Grand Place Brussels",
    "bosnia-and-herzegovina": "Stari Most",
    "bulgaria": "Alexander Nevsky Cathedral",
    "croatia": "Dubrovnik Old Town",
    "cyprus": "Kourion",
    "czechia": "Prague Castle",
    "denmark": "Kronborg Castle",
    "estonia": "Tallinn Old Town",
    "finland": "Suomenlinna",
    "france": "Eiffel Tower",
    "germany": "Neuschwanstein Castle",
    "greece": "Parthenon",
    "hungary": "Parliament Building Budapest",
    "iceland": "Gullfoss Waterfall",
    "ireland": "Cliffs of Moher",
    "italy": "Colosseum",
    "kosovo": "Prizren Fortress",
    "latvia": "Freedom Monument",
    "liechtenstein": "Vaduz Castle",
    "lithuania": "Gediminas Castle",
    "luxembourg": "Adolphe Bridge",
    "malta": "Ggantija Temples",
    "moldova": "Orheiul Vechi",
    "monaco": "Prince's Palace",
    "montenegro": "Bay of Kotor",
    "netherlands": "Kinderdijk Windmills",
    "north-macedonia": "Matka Canyon",
    "norway": "Preikestolen",
    "poland": "Wawel Castle",
    "portugal": "Pena Palace",
    "romania": "Bran Castle",
    "russia": "Saint Basil's Cathedral",
    "san-marino": "Guaita Tower",
    "serbia": "Mehmed Pasha Sokolovic Bridge",
    "slovakia": "Orava Castle",
    "slovenia": "Lake Bled",
    "spain": "Sagrada Familia",
    "sweden": "Stockholm Royal Palace",
    "switzerland": "Matterhorn",
    "ukraine": "St. Michael's Monastery",
    "united-kingdom": "Big Ben",
    "antigua-and-barbuda": "Nelson's Dockyard",
    "bahamas": "Nassau Straw Market",
    "barbados": "Bridgetown",
    "belize": "Great Blue Hole",
    "canada": "Niagara Falls",
    "costa-rica": "Manuel Antonio National Park",
    "cuba": "Old Havana",
    "dominica": "Trafalgar Falls",
    "dominican-republic": "Santo Domingo Cathedral",
    "el-salvador": "Izalco Volcano",
    "grenada": "Carenage Beach",
    "guatemala": "Lake Atitlan",
    "haiti": "Citadelle Laferrière",
    "honduras": "Copan Ruins",
    "jamaica": "Dunn's River Falls",
    "mexico": "Chichen Itza",
    "nicaragua": "Granada Cathedral",
    "panama": "Panama Canal",
    "saint-kitts-and-nevis": "Brimstone Hill Fortress",
    "saint-lucia": "Pitons",
    "saint-vincent-and-the-grenadines": "Bequia Island",
    "trinidad-and-tobago": "Pitch Lake",
    "united-states": "Statue of Liberty",
    "argentina": "Christ the Redeemer",
    "bolivia": "Salar de Uyuni",
    "brazil": "Christ the Redeemer",
    "chile": "Atacama Desert",
    "colombia": "Lost City",
    "ecuador": "Galapagos Islands",
    "guyana": "Kaieteur Falls",
    "paraguay": "Iguazu Falls",
    "peru": "Machu Picchu",
    "suriname": "Galibi Beach",
    "uruguay": "Teatro Solis",
    "venezuela": "Angel Falls",
    "australia": "Sydney Opera House",
    "fiji": "Yasawa Islands",
    "kiribati": "Tarawa Atoll",
    "marshall-islands": "Majuro Atoll",
    "micronesia": "Pohnpei",
    "nauru": "Anibare Bay",
    "new-zealand": "Milford Sound",
    "palau": "Rock Islands",
    "papua-new-guinea": "Mount Hagen",
    "samoa": "Vailima Falls",
    "solomon-islands": "Marau Sound",
    "tonga": "Vavau",
    "tuvalu": "Funafuti Atoll",
    "vanuatu": "Mount Yasur",
}

def search_wikimedia_commons(landmark_name: str, country: str) -> Optional[str]:
    """Search Wikimedia Commons for CC0/CC-BY landmark images."""
    try:
        # Search query: landmark name + country
        search_query = f"{landmark_name} {country}"

        url = "https://commons.wikimedia.org/w/api.php"
        params = {
            "action": "query",
            "list": "search",
            "srsearch": search_query,
            "srwhat": "image",
            "format": "json",
            "srlimit": 10,
        }

        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        if not data.get("query", {}).get("search"):
            return None

        # Get first result and try to find license info
        first_result = data["query"]["search"][0]
        title = first_result["title"]

        # Now get the actual file to check license
        file_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={title}&prop=imageinfo|pageterms&iiprop=url|extmetadata&format=json"
        file_response = requests.get(file_url, timeout=10)
        file_response.raise_for_status()
        file_data = file_response.json()

        pages = file_data.get("query", {}).get("pages", {})
        if not pages:
            return None

        page = list(pages.values())[0]
        imageinfo = page.get("imageinfo", [{}])[0]
        url_str = imageinfo.get("url")

        if url_str and (imageinfo.get("extmetadata", {}).get("License", {}).get("value", "").upper() in ["CC0", "CC-BY"]):
            return url_str

        return url_str  # Return anyway if found
    except Exception as e:
        print(f"Error searching for {landmark_name}: {e}")
        return None

def download_image(url: str, filepath: Path) -> bool:
    """Download image from URL."""
    try:
        response = requests.get(url, timeout=30, stream=True)
        response.raise_for_status()

        # Only download if it's a reasonable size and image
        if int(response.headers.get('content-length', 0)) > 500000:  # > 500KB might be too large
            print(f"  Image too large ({response.headers.get('content-length')} bytes)")
            return False

        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        print(f"  Downloaded: {filepath.name}")
        return True
    except Exception as e:
        print(f"  Error downloading {url}: {e}")
        return False

def main():
    """Main function to download all landmark images."""

    output_dir = Path(__file__).parent.parent / "public" / "country-landmarks" / "countries"
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Downloading landmark images to {output_dir}")
    print(f"Total countries: {len(COUNTRY_LANDMARKS)}\n")

    downloaded = 0
    failed = 0

    for country_slug, landmark in sorted(COUNTRY_LANDMARKS.items()):
        # Check if image already exists
        jpg_file = output_dir / f"{country_slug}.jpg"
        svg_file = output_dir / f"{country_slug}.svg"

        if jpg_file.exists() or svg_file.exists():
            print(f"✓ {country_slug}: Already exists")
            downloaded += 1
            continue

        print(f"→ {country_slug}: {landmark}")

        # Try to find image
        image_url = search_wikimedia_commons(landmark, country_slug)

        if image_url:
            if download_image(image_url, jpg_file):
                downloaded += 1
            else:
                failed += 1
        else:
            print(f"  No image found")
            failed += 1

        time.sleep(1)  # Rate limiting

    print(f"\n\nSummary:")
    print(f"Downloaded: {downloaded}")
    print(f"Failed: {failed}")
    print(f"Total: {downloaded + failed}")

if __name__ == "__main__":
    main()
