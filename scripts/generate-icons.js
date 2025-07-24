#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

// Einfache Console Farben
const colors = {
    red: (text) => `\x1b[31m${text}\x1b[0m`,
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    blue: (text) => `\x1b[34m${text}\x1b[0m`
};

console.log(colors.blue('🎨 Generating PWA Icons...'));

const iconSizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];
const splashSizes = [
    { width: 320, height: 568 },   // iPhone 5/SE
    { width: 375, height: 667 },   // iPhone 6/7/8
    { width: 414, height: 736 },   // iPhone 6/7/8 Plus
    { width: 375, height: 812 },   // iPhone X/XS
    { width: 414, height: 896 },   // iPhone XR/XS Max
    { width: 768, height: 1024 },  // iPad
    { width: 1024, height: 1366 }  // iPad Pro
];

async function generateIcons() {
    try {
        const iconsDir = path.join(__dirname, '..', 'icons');
        await fs.ensureDir(iconsDir);

        // Base SVG für Icon (erstelle ein einfaches KleHausen Logo)
        const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <rect width="512" height="512" fill="#ff7b00"/>
            <circle cx="256" cy="200" r="80" fill="white"/>
            <rect x="180" y="280" width="152" height="40" rx="20" fill="white"/>
            <text x="256" y="380" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">KH</text>
        </svg>`;

        // Speichere base SVG
        await fs.writeFile(path.join(iconsDir, 'icon-base.svg'), svgIcon);

        // Generiere Icons in verschiedenen Größen
        for (const size of iconSizes) {
            const buffer = Buffer.from(svgIcon);
            const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
            
            await sharp(buffer)
                .resize(size, size)
                .png()
                .toFile(outputPath);
                
            console.log(colors.green(`✓ Generated icon-${size}x${size}.png`));
        }

        // Generiere Splash Screens
        console.log(colors.blue('🖼️  Generating splash screens...'));
        
        for (const splash of splashSizes) {
            const splashSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${splash.width} ${splash.height}">
                <rect width="${splash.width}" height="${splash.height}" fill="#0f0f0f"/>
                <circle cx="${splash.width/2}" cy="${splash.height/2 - 50}" r="60" fill="#ff7b00"/>
                <text x="${splash.width/2}" y="${splash.height/2 + 50}" text-anchor="middle" fill="#ff7b00" font-family="Arial, sans-serif" font-size="32" font-weight="bold">KleHausen</text>
                <text x="${splash.width/2}" y="${splash.height/2 + 80}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16">Discord Community</text>
            </svg>`;
            
            const buffer = Buffer.from(splashSvg);
            const outputPath = path.join(iconsDir, `splash-${splash.width}x${splash.height}.png`);
            
            await sharp(buffer)
                .resize(splash.width, splash.height)
                .png()
                .toFile(outputPath);
                
            console.log(colors.green(`✓ Generated splash-${splash.width}x${splash.height}.png`));
        }

        // Erstelle favicon.ico
        const buffer = Buffer.from(svgIcon);
        await sharp(buffer)
            .resize(32, 32)
            .png()
            .toFile(path.join(__dirname, '..', 'favicon.ico'));
            
        console.log(colors.green('✓ Generated favicon.ico'));

        console.log(colors.green('✅ All icons generated successfully!'));
        
    } catch (error) {
        console.error(colors.red('❌ Icon generation failed:'), error.message);
        process.exit(1);
    }
}

generateIcons();
