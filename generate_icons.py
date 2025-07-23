#!/usr/bin/env python3
"""
KleHausen Splash Screen Icon Generator
Erstellt alle benötigten Icons und Splash Screens für PWA auf allen Plattformen
"""

import os
from PIL import Image, ImageDraw, ImageFont
import math

# Erstelle icons Verzeichnis falls es nicht existiert
if not os.path.exists('icons'):
    os.makedirs('icons')

def create_gradient_background(width, height, color1=(26, 26, 26), color2=(255, 123, 0)):
    """Erstellt einen diagonalen Gradienten-Hintergrund"""
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    # Diagonaler Gradient
    for y in range(height):
        for x in range(width):
            # Berechne Gradient Position (0-1)
            ratio = math.sqrt((x/width)**2 + (y/height)**2) / math.sqrt(2)
            ratio = min(1, ratio)
            
            # Interpoliere zwischen den Farben
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            
            draw.point((x, y), (r, g, b))
    
    return image

def create_logo_overlay(width, height):
    """Erstellt das KleHausen Logo Overlay"""
    # Erstelle transparentes Overlay
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Logo Kreis
    logo_size = min(width, height) // 3
    logo_x = (width - logo_size) // 2
    logo_y = (height - logo_size) // 2
    
    # Orange Kreis mit Gradient
    draw.ellipse([logo_x, logo_y, logo_x + logo_size, logo_y + logo_size], 
                fill=(255, 123, 0, 255), outline=(255, 149, 0, 255), width=3)
    
    # Inner shadow effect
    shadow_offset = logo_size // 20
    draw.ellipse([logo_x + shadow_offset, logo_y + shadow_offset, 
                 logo_x + logo_size - shadow_offset, logo_y + logo_size - shadow_offset], 
                fill=(0, 0, 0, 50))
    
    # Text "KH" in der Mitte
    try:
        # Versuche eine System-Schrift zu laden
        font_size = logo_size // 4
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    text = "KH"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_x = logo_x + (logo_size - text_width) // 2
    text_y = logo_y + (logo_size - text_height) // 2
    
    # Text mit Schatten
    draw.text((text_x + 2, text_y + 2), text, fill=(0, 0, 0, 128), font=font)
    draw.text((text_x, text_y), text, fill=(255, 255, 255, 255), font=font)
    
    return overlay

def create_icon(size):
    """Erstellt ein Icon in der angegebenen Größe"""
    # Erstelle Hintergrund
    background = create_gradient_background(size, size)
    
    # Erstelle Logo Overlay
    logo = create_logo_overlay(size, size)
    
    # Kombiniere Background und Logo
    icon = Image.alpha_composite(background.convert('RGBA'), logo)
    
    return icon.convert('RGB')

def create_splash_screen(width, height):
    """Erstellt einen Splash Screen für die angegebenen Dimensionen"""
    # Erstelle Hintergrund
    background = create_gradient_background(width, height, (26, 26, 26), (45, 45, 45))
    
    # Erstelle Logo (kleiner für Splash Screen)
    logo = create_logo_overlay(width, height)
    
    # Text hinzufügen
    draw = ImageDraw.Draw(background)
    
    try:
        title_font = ImageFont.truetype("arial.ttf", height // 20)
        subtitle_font = ImageFont.truetype("arial.ttf", height // 30)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # Titel "KleHausen"
    title = "KleHausen"
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2
    title_y = height // 2 + height // 8
    
    # Titel mit Schatten
    draw.text((title_x + 3, title_y + 3), title, fill=(0, 0, 0, 128), font=title_font)
    draw.text((title_x, title_y), title, fill=(255, 255, 255), font=title_font)
    
    # Untertitel
    subtitle = "Kreative Discord Community"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (width - subtitle_width) // 2
    subtitle_y = title_y + title_bbox[3] - title_bbox[1] + 20
    
    # Untertitel mit Schatten
    draw.text((subtitle_x + 2, subtitle_y + 2), subtitle, fill=(0, 0, 0, 128), font=subtitle_font)
    draw.text((subtitle_x, subtitle_y), subtitle, fill=(204, 204, 204), font=subtitle_font)
    
    # Kombiniere mit Logo
    splash = Image.alpha_composite(background.convert('RGBA'), logo)
    
    return splash.convert('RGB')

# Icon Größen für PWA
icon_sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512]

print("Generiere PWA Icons...")
for size in icon_sizes:
    icon = create_icon(size)
    filename = f'icons/icon-{size}x{size}.png'
    icon.save(filename, 'PNG')
    print(f"✓ {filename}")

# Favicon
icon_32 = create_icon(32)
icon_32.save('favicon.ico', 'ICO')
print("✓ favicon.ico")

# iOS Splash Screen Größen
splash_sizes = {
    # iPhone
    'splash-1080x1920.png': (1080, 1920),  # iPhone 6/7/8 Plus
    'splash-1920x1080.png': (1920, 1080),  # iPhone 6/7/8 Plus Landscape
    'splash-1125x2436.png': (1125, 2436),  # iPhone X/XS
    'splash-2436x1125.png': (2436, 1125),  # iPhone X/XS Landscape
    'splash-1242x2688.png': (1242, 2688),  # iPhone XS Max
    'splash-2688x1242.png': (2688, 1242),  # iPhone XS Max Landscape
    'splash-828x1792.png': (828, 1792),    # iPhone XR
    'splash-1792x828.png': (1792, 828),    # iPhone XR Landscape
    'splash-1170x2532.png': (1170, 2532),  # iPhone 12/13 Pro
    'splash-2532x1170.png': (2532, 1170),  # iPhone 12/13 Pro Landscape
    'splash-1284x2778.png': (1284, 2778),  # iPhone 12/13 Pro Max
    'splash-2778x1284.png': (2778, 1284),  # iPhone 12/13 Pro Max Landscape
    
    # iPad
    'splash-1536x2048.png': (1536, 2048),  # iPad Mini/Air
    'splash-2048x1536.png': (2048, 1536),  # iPad Mini/Air Landscape
    'splash-1668x2388.png': (1668, 2388),  # iPad Pro 11"
    'splash-2388x1668.png': (2388, 1668),  # iPad Pro 11" Landscape
    'splash-2048x2732.png': (2048, 2732),  # iPad Pro 12.9"
    'splash-2732x2048.png': (2732, 2048),  # iPad Pro 12.9" Landscape
}

print("\nGeneriere iOS Splash Screens...")
for filename, (width, height) in splash_sizes.items():
    splash = create_splash_screen(width, height)
    filepath = f'icons/{filename}'
    splash.save(filepath, 'PNG')
    print(f"✓ {filepath}")

print(f"\n🎉 Erfolgreich {len(icon_sizes)} Icons und {len(splash_sizes)} Splash Screens generiert!")
print("📱 Alle Dateien wurden im 'icons/' Verzeichnis erstellt.")
print("🚀 Die PWA ist jetzt bereit für alle Plattformen!")
