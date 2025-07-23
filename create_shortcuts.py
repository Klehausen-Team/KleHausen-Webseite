#!/usr/bin/env python3
"""
Admin Shortcut Icon Generator
"""

from PIL import Image, ImageDraw

def create_admin_icon():
    # Erstelle Admin Icon (Crown)
    img = Image.new('RGB', (96, 96), (255, 123, 0))
    draw = ImageDraw.Draw(img)
    
    # Weißer Hintergrund-Kreis
    margin = 8
    draw.ellipse([margin, margin, 96-margin, 96-margin], 
                fill=(255, 255, 255), outline=(255, 149, 0), width=2)
    
    # Crown (vereinfacht als Polygon)
    crown_points = [
        (30, 35),   # Links unten
        (25, 25),   # Links oben
        (35, 30),   # Erste Spitze
        (48, 20),   # Mittlere Spitze (höchste)
        (61, 30),   # Zweite Spitze
        (71, 25),   # Rechts oben
        (66, 35),   # Rechts unten
        (30, 35)    # Zurück zum Start
    ]
    
    draw.polygon(crown_points, fill=(255, 123, 0))
    
    # Crown Base
    draw.rectangle([28, 35, 68, 45], fill=(255, 123, 0))
    
    # Crown Details (Jewels)
    draw.ellipse([38, 32, 42, 36], fill=(255, 255, 255))
    draw.ellipse([46, 27, 50, 31], fill=(255, 255, 255))
    draw.ellipse([54, 32, 58, 36], fill=(255, 255, 255))
    
    # Text "ADMIN" unten
    try:
        from PIL import ImageFont
        font = ImageFont.truetype("arial.ttf", 10)
    except:
        font = ImageFont.load_default()
    
    text = "ADMIN"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_x = (96 - text_width) // 2
    text_y = 55
    
    draw.text((text_x, text_y), text, fill=(255, 123, 0), font=font)
    
    return img

def create_projects_icon():
    # Erstelle Projekte Icon
    img = Image.new('RGB', (96, 96), (255, 123, 0))
    draw = ImageDraw.Draw(img)
    
    # Weißer Hintergrund-Kreis
    margin = 8
    draw.ellipse([margin, margin, 96-margin, 96-margin], 
                fill=(255, 255, 255), outline=(255, 149, 0), width=2)
    
    # Project diagram (vereinfacht)
    # Zentrale Box
    draw.rectangle([40, 35, 56, 45], fill=(255, 123, 0))
    
    # Verbundene Boxen
    draw.rectangle([20, 25, 30, 32], fill=(255, 123, 0))
    draw.rectangle([66, 25, 76, 32], fill=(255, 123, 0))
    draw.rectangle([20, 55, 30, 62], fill=(255, 123, 0))
    draw.rectangle([66, 55, 76, 62], fill=(255, 123, 0))
    
    # Verbindungslinien
    draw.line([(30, 28), (40, 40)], fill=(255, 123, 0), width=2)
    draw.line([(66, 28), (56, 40)], fill=(255, 123, 0), width=2)
    draw.line([(30, 58), (40, 45)], fill=(255, 123, 0), width=2)
    draw.line([(66, 58), (56, 45)], fill=(255, 123, 0), width=2)
    
    return img

def create_discord_icon():
    # Erstelle Discord Icon
    img = Image.new('RGB', (96, 96), (114, 137, 218))  # Discord Blue
    draw = ImageDraw.Draw(img)
    
    # Weißer Hintergrund-Kreis
    margin = 8
    draw.ellipse([margin, margin, 96-margin, 96-margin], 
                fill=(255, 255, 255), outline=(114, 137, 218), width=2)
    
    # Discord Logo (vereinfacht)
    # Controller-ähnliche Form
    draw.rounded_rectangle([25, 30, 71, 55], radius=8, fill=(114, 137, 218))
    
    # "Augen"
    draw.ellipse([32, 37, 40, 45], fill=(255, 255, 255))
    draw.ellipse([56, 37, 64, 45], fill=(255, 255, 255))
    
    # "Mund" 
    draw.arc([35, 45, 61, 60], start=0, end=180, fill=(114, 137, 218), width=3)
    
    return img

# Generiere Icons
print("Generiere Shortcut Icons...")

admin_icon = create_admin_icon()
admin_icon.save('icons/shortcut-admin.png')
print("✓ shortcut-admin.png")

projects_icon = create_projects_icon()
projects_icon.save('icons/shortcut-projects.png')
print("✓ shortcut-projects.png")

discord_icon = create_discord_icon()
discord_icon.save('icons/shortcut-discord.png')
print("✓ shortcut-discord.png")

print("🎉 Shortcut Icons erfolgreich generiert!")
