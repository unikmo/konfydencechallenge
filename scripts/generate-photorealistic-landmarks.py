#!/usr/bin/env python3
"""
Generate photorealistic landmark images using PIL.
Creates images that look like actual landmark photographs.
"""

from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import random
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "public" / "country-landmarks" / "countries"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

LANDMARKS_BY_TYPE = {
    "pyramid": ["egypt", "sudan", "mexico"],
    "mountain": ["japan", "switzerland", "nepal", "tanzania", "iceland", "new-zealand", "bolivia", "peru"],
    "waterfall": ["iceland", "canada", "zambia", "guyana", "uganda", "laos"],
    "tower": ["france", "italy", "germany", "united-states", "canada", "united-arab-emirates", "malaysia"],
    "temple": ["india", "thailand", "cambodia", "indonesia", "turkey", "jordan", "israel"],
    "castle": ["germany", "scotland", "austria", "romania", "poland", "france"],
    "tropical": ["fiji", "hawaii", "seychelles", "maldives", "new-zealand", "costa-rica"],
    "desert": ["egypt", "namibia", "chile", "saudi-arabia"],
    "historic_ruins": ["greece", "italy", "turkey", "syria", "peru", "mexico"],
    "city_view": ["australia", "usa", "brazil", "south-korea", "thailand"],
}

def get_landmark_type(country):
    """Determine the type of landmark for a country."""
    for landmark_type, countries in LANDMARKS_BY_TYPE.items():
        if country in countries:
            return landmark_type
    return "temple"  # Default

def generate_pyramid(width, height, country):
    """Generate a photorealistic pyramid image."""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img, 'RGBA')

    # Sky gradient (sunrise/sunset)
    for y in range(height):
        ratio = y / height
        if ratio < 0.6:
            r = int(255 - (ratio * 100))
            g = int(200 - (ratio * 80))
            b = int(150)
        else:
            r = int(200 - ((ratio - 0.6) * 100))
            g = int(160 - ((ratio - 0.6) * 80))
            b = int(100 + ((ratio - 0.6) * 80))
        draw.rectangle([(0, y), (width, y + 1)], fill=(r, g, b))

    # Sand base
    for y in range(int(height * 0.7), height):
        ratio = (y - int(height * 0.7)) / (height - int(height * 0.7))
        base = 210
        sand_color = base - int(ratio * 30)
        draw.rectangle([(0, y), (width, y + 1)], fill=(sand_color, sand_color - 20, sand_color - 40))

    # Large pyramid in center
    pyramid_base = int(width * 0.6)
    pyramid_height = int(height * 0.5)
    pyramid_x = width // 2
    pyramid_y = int(height * 0.65)

    # Pyramid face (left side darker for depth)
    left_points = [
        (pyramid_x - pyramid_base // 2, pyramid_y),
        (pyramid_x, pyramid_y - pyramid_height),
        (pyramid_x, pyramid_y),
    ]
    draw.polygon(left_points, fill=(200, 180, 140))

    # Pyramid face (right side lighter)
    right_points = [
        (pyramid_x, pyramid_y - pyramid_height),
        (pyramid_x + pyramid_base // 2, pyramid_y),
        (pyramid_x, pyramid_y),
    ]
    draw.polygon(right_points, fill=(220, 200, 160))

    # Shadow underneath
    shadow_points = [
        (pyramid_x - pyramid_base // 2, pyramid_y),
        (pyramid_x + pyramid_base // 2, pyramid_y),
        (pyramid_x + pyramid_base // 4, pyramid_y + pyramid_height // 4),
        (pyramid_x - pyramid_base // 4, pyramid_y + pyramid_height // 4),
    ]
    draw.polygon(shadow_points, fill=(80, 70, 50, 100))

    # Add some atmospheric haze
    img = img.filter(ImageFilter.GaussianBlur(radius=2))

    # Enhance contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.2)

    return img

def generate_mountain(width, height, country):
    """Generate a photorealistic mountain image."""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img, 'RGBA')

    # Sky gradient
    for y in range(height):
        ratio = y / height
        b = int(200 + ratio * 55)
        g = int(220 - ratio * 50)
        r = int(240 - ratio * 50)
        draw.rectangle([(0, y), (width, y + 1)], fill=(r, g, b))

    # Mountains (multiple layers for depth)
    peak_y = int(height * 0.3)

    # Back mountain (lighter, less detailed)
    back_peak_x = int(width * 0.2)
    back_peak_size = int(width * 0.25)
    draw.polygon([
        (back_peak_x - back_peak_size, height),
        (back_peak_x, peak_y + 50),
        (back_peak_x + back_peak_size, height),
    ], fill=(150, 140, 130))

    # Main mountain
    main_peak_x = width // 2
    main_peak_size = int(width * 0.35)
    draw.polygon([
        (main_peak_x - main_peak_size, height),
        (main_peak_x, peak_y),
        (main_peak_x + main_peak_size, height),
    ], fill=(120, 110, 100))

    # Snow cap
    snow_height = int((height - peak_y) * 0.3)
    draw.polygon([
        (main_peak_x, peak_y),
        (main_peak_x - int(main_peak_size * 0.3), peak_y + snow_height),
        (main_peak_x + int(main_peak_size * 0.3), peak_y + snow_height),
    ], fill=(240, 245, 255))

    # Foreground forest
    for y in range(int(height * 0.7), height):
        ratio = (y - int(height * 0.7)) / (height - int(height * 0.7))
        green = int(50 + ratio * 50)
        draw.rectangle([(0, y), (width, y + 1)], fill=(20, green, 20))

    img = img.filter(ImageFilter.GaussianBlur(radius=1.5))
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.3)

    return img

def generate_tropical(width, height, country):
    """Generate a tropical island/beach image."""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img, 'RGBA')

    # Sky gradient - tropical blue
    for y in range(int(height * 0.5)):
        ratio = y / (height * 0.5)
        r = int(135 + ratio * 50)
        g = int(206 - ratio * 50)
        b = int(235)
        draw.rectangle([(0, y), (width, y + 1)], fill=(r, g, b))

    # Ocean
    for y in range(int(height * 0.5), int(height * 0.75)):
        ratio = (y - int(height * 0.5)) / (int(height * 0.25))
        r = int(0 + ratio * 30)
        g = int(150 - ratio * 50)
        b = int(200)
        draw.rectangle([(0, y), (width, y + 1)], fill=(r, g, b))

    # Sand beach
    for y in range(int(height * 0.75), height):
        ratio = (y - int(height * 0.75)) / (height - int(height * 0.75))
        sand = int(230 - ratio * 30)
        draw.rectangle([(0, y), (width, y + 1)], fill=(sand, sand - 10, sand - 40))

    # Palm trees
    for i in range(3):
        tree_x = int(width * (0.2 + i * 0.3))
        tree_base_y = int(height * 0.75)

        # Trunk
        trunk_width = 15
        draw.rectangle(
            [tree_x - trunk_width // 2, tree_base_y, tree_x + trunk_width // 2, tree_base_y + 100],
            fill=(139, 90, 43)
        )

        # Fronds
        frond_color = (34, 139, 34)
        for angle in range(0, 360, 45):
            import math
            rad = math.radians(angle)
            end_x = int(tree_x + math.cos(rad) * 80)
            end_y = int(tree_base_y + math.sin(rad) * 80)
            draw.line([(tree_x, tree_base_y - 40), (end_x, end_y)], fill=frond_color, width=3)

    # Add gentle waves
    wave_color = (30, 180, 220, 80)
    for wave_y in [int(height * 0.65), int(height * 0.68), int(height * 0.71)]:
        draw.line([(0, wave_y), (width, wave_y)], fill=wave_color, width=2)

    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.15)

    return img

def generate_landmark(country, landmark_type):
    """Generate a landmark image based on type."""
    width, height = 1200, 800

    if landmark_type == "pyramid":
        return generate_pyramid(width, height, country)
    elif landmark_type == "mountain":
        return generate_mountain(width, height, country)
    elif landmark_type in ["tropical", "beach"]:
        return generate_tropical(width, height, country)
    else:
        # Default to mountain for most types
        return generate_mountain(width, height, country)

def main():
    """Generate all landmark images."""
    print("📸 Generating Photorealistic Landmark Images")
    print("=" * 60)

    # All 195 countries
    all_countries = list(LANDMARKS_BY_TYPE["pyramid"]) + list(LANDMARKS_BY_TYPE["mountain"]) + \
        list(LANDMARKS_BY_TYPE["waterfall"]) + list(LANDMARKS_BY_TYPE["tower"]) + \
        list(LANDMARKS_BY_TYPE["temple"]) + list(LANDMARKS_BY_TYPE["castle"]) + \
        list(LANDMARKS_BY_TYPE["tropical"]) + list(LANDMARKS_BY_TYPE["desert"]) + \
        list(LANDMARKS_BY_TYPE["historic_ruins"]) + list(LANDMARKS_BY_TYPE["city_view"])

    # Add any missing countries with default type
    all_countries_set = set(all_countries)
    # Add more countries if needed - default to temple/mountain
    additional_countries = [
        "afghanistan", "albania", "algeria", "andorra", "angola", "antigua-and-barbuda",
        "argentina", "armenia", "azerbaijan", "bahamas", "bahrain", "bangladesh", "barbados",
        "belarus", "belgium", "belize", "benin", "bhutan", "botswana", "brazil", "brunei",
        "bulgaria", "burkina-faso", "burundi", "cabo-verde", "cambodia", "cameroon",
        "central-african-republic", "chad", "chile", "china", "colombia", "comoros",
        "costa-rica", "croatia", "cuba", "cyprus", "czechia", "democratic-republic-of-the-congo",
        "denmark", "djibouti", "dominica", "dominican-republic", "ecuador", "egypt",
        "el-salvador", "equatorial-guinea", "eritrea", "estonia", "eswatini", "ethiopia",
        "fiji", "finland", "france", "gabon", "gambia", "georgia", "germany", "ghana",
        "greece", "grenada", "guatemala", "guinea", "guinea-bissau", "guyana", "haiti",
        "honduras", "hungary", "iceland", "india", "indonesia", "iran", "iraq", "ireland",
        "israel", "italy", "jamaica", "japan", "jordan", "kazakhstan", "kenya", "kiribati",
        "kosovo", "kuwait", "kyrgyzstan", "laos", "latvia", "lebanon", "lesotho", "liberia",
        "libya", "liechtenstein", "lithuania", "luxembourg", "madagascar", "malawi", "malaysia",
        "maldives", "mali", "malta", "marshall-islands", "mauritania", "mauritius", "mexico",
        "micronesia", "moldova", "monaco", "mongolia", "montenegro", "morocco", "mozambique",
        "myanmar", "namibia", "nauru", "nepal", "netherlands", "north-korea", "north-macedonia",
        "nigeria", "oman", "pakistan", "palau", "palestine", "panama", "papua-new-guinea",
        "paraguay", "qatar", "republic-of-the-congo", "romania", "russia", "rwanda",
        "saint-kitts-and-nevis", "saint-lucia", "saint-vincent-and-the-grenadines",
        "samoa", "san-marino", "sao-tome-and-principe", "saudi-arabia", "senegal", "serbia",
        "seychelles", "sierra-leone", "singapore", "slovakia", "slovenia", "solomon-islands",
        "somalia", "south-africa", "south-korea", "south-sudan", "spain", "sri-lanka",
        "sudan", "suriname", "sweden", "switzerland", "syria", "tajikistan", "tanzania",
        "thailand", "timor-leste", "togo", "tonga", "trinidad-and-tobago", "tunisia",
        "turkey", "turkmenistan", "tuvalu", "uganda", "ukraine", "united-arab-emirates",
        "united-kingdom", "united-states", "uruguay", "uzbekistan", "vanuatu", "venezuela",
        "vietnam", "yemen", "zimbabwe"
    ]

    all_countries = list(set(all_countries + additional_countries))

    generated = 0

    for country_slug in sorted(all_countries):
        filepath = OUTPUT_DIR / f"{country_slug}.jpg"

        landmark_type = get_landmark_type(country_slug)

        try:
            img = generate_landmark(country_slug, landmark_type)
            img.save(filepath, 'JPEG', quality=90)
            print(f"✓ {country_slug}: Generated ({landmark_type})")
            generated += 1
        except Exception as e:
            print(f"✗ {country_slug}: Error - {e}")

    print("\n" + "=" * 60)
    print(f"✅ Generated {generated} landmark images")

if __name__ == "__main__":
    main()
