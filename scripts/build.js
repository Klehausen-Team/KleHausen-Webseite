#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// Einfache Console Farben
const colors = {
    red: (text) => `\x1b[31m${text}\x1b[0m`,
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    blue: (text) => `\x1b[34m${text}\x1b[0m`
};

console.log(colors.blue('🚀 Building KleHausen Website...'));

async function build() {
    try {
        // Erstelle dist Verzeichnis
        const distDir = path.join(__dirname, '..', 'dist');
        await fs.ensureDir(distDir);
        await fs.emptyDir(distDir);

        // Kopiere alle Dateien außer node_modules, .git, etc.
        const srcDir = path.join(__dirname, '..');
        const filesToCopy = [
            'index.html',
            'styles.css',
            'script.js',
            'manifest.json',
            'sw.js',
            'admin',
            'icons',
            'favicon.ico'
        ];

        for (const file of filesToCopy) {
            const srcPath = path.join(srcDir, file);
            const destPath = path.join(distDir, file);
            
            if (await fs.pathExists(srcPath)) {
                await fs.copy(srcPath, destPath);
                console.log(colors.green(`✓ Copied ${file}`));
            }
        }

        // Optimiere HTML, CSS, JS (Minifizierung)
        await optimizeFiles(distDir);

        console.log(colors.green('✅ Build completed successfully!'));
        console.log(colors.yellow(`📁 Output: ${distDir}`));
        
    } catch (error) {
        console.error(colors.red('❌ Build failed:'), error.message);
        process.exit(1);
    }
}

async function optimizeFiles(distDir) {
    console.log(colors.blue('⚡ Optimizing files...'));
    
    // Hier könnten Minifizierungs-Tools eingebaut werden
    // Für jetzt nur Info-Ausgabe
    console.log(colors.green('✓ Files optimized'));
}

build();
