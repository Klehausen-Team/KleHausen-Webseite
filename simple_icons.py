#!/usr/bin/env python3
"""
Einfacher KleHausen Icon Generator
"""

import os
from PIL import Image, ImageDraw, ImageFont

# Erstelle icons Verzeichnis
if not os.path.exists('icons'):
    os.makedirs('icons')

def create_simple_icon(size):
    """Erstellt ein einfaches Icon"""
    # Orange Hintergrund
    img = Image.new('RGB', (size, size), (255, 123, 0))
    draw = ImageDraw.Draw(img)
    
    # Weißer Kreis in der Mitte
    margin = size // 8
    draw.ellipse([margin, margin, size-margin, size-margin], 
                fill=(255, 255, 255), outline=(255, 149, 0), width=size//50 or 1)
    
    # Text "KH"
    try:
        font_size = size // 3
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    text = "KH"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = (size - text_height) // 2
    
    draw.text((x, y), text, fill=(255, 123, 0), font=font)
    
    return img

def create_simple_splash(width, height):
    """Erstellt einen einfachen Splash Screen"""
    # Dunkler Hintergrund
    img = Image.new('RGB', (width, height), (26, 26, 26))
    draw = ImageDraw.Draw(img)
    
    # Logo in der Mitte
    logo_size = min(width, height) // 4
    logo_x = (width - logo_size) // 2
    logo_y = (height - logo_size) // 2
    
    # Orange Kreis
    draw.ellipse([logo_x, logo_y, logo_x + logo_size, logo_y + logo_size], 
                fill=(255, 123, 0))
    
    # Text "KleHausen" darunter
    try:
        font = ImageFont.truetype("arial.ttf", height // 25)
    except:
        font = ImageFont.load_default()
    
    text = "KleHausen"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_x = (width - text_width) // 2
    text_y = logo_y + logo_size + 20
    
    draw.text((text_x, text_y), text, fill=(255, 255, 255), font=font)
    
    return img

# Generiere Icons
print("Generiere Icons...")
for size in [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512]:
    icon = create_simple_icon(size)
    icon.save(f'icons/icon-{size}x{size}.png')
    print(f"✓ icon-{size}x{size}.png")

# Favicon
create_simple_icon(32).save('favicon.ico')
print("✓ favicon.ico")

# Nur die wichtigsten Splash Screens
splash_sizes = [
    (1080, 1920),  # Standard Mobile Portrait
    (1920, 1080),  # Standard Mobile Landscape
    (1536, 2048),  # iPad Portrait
    (2048, 1536),  # iPad Landscape
]

print("Generiere Splash Screens...")
for i, (width, height) in enumerate(splash_sizes):
    splash = create_simple_splash(width, height)
    splash.save(f'icons/splash-{width}x{height}.png')
    print(f"✓ splash-{width}x{height}.png")

print("🎉 Fertig! Alle Icons und Splash Screens generiert.")
