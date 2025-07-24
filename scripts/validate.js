#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// Einfache Console Farben ohne chalk für Kompatibilität
const colors = {
    red: (text) => `\x1b[31m${text}\x1b[0m`,
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    blue: (text) => `\x1b[34m${text}\x1b[0m`
};

console.log(colors.blue('🔍 Validating KleHausen Website...'));

async function validate() {
    const errors = [];
    const warnings = [];
    
    try {
        // Prüfe erforderliche Dateien
        const requiredFiles = [
            'index.html',
            'styles.css', 
            'script.js',
            'manifest.json',
            'sw.js',
            'admin/index.html',
            'admin/admin-styles.css',
            'admin/admin-script.js'
        ];

        for (const file of requiredFiles) {
            const filePath = path.join(__dirname, '..', file);
            if (!await fs.pathExists(filePath)) {
                errors.push(`Missing required file: ${file}`);
            } else {
                console.log(colors.green(`✓ Found ${file}`));
            }
        }

        // Prüfe HTML-Struktur
        await validateHTML();
        
        // Prüfe CSS
        await validateCSS();
        
        // Prüfe JavaScript
        await validateJS();
        
        // Prüfe PWA-Manifest
        await validateManifest();

        // Prüfe Admin Panel
        await validateAdmin();

        // Ergebnisse
        if (errors.length > 0) {
            console.log(colors.red('\n❌ Validation failed:'));
            errors.forEach(error => console.log(colors.red(`  • ${error}`)));
        }
        
        if (warnings.length > 0) {
            console.log(colors.yellow('\n⚠️  Warnings:'));
            warnings.forEach(warning => console.log(colors.yellow(`  • ${warning}`)));
        }
        
        if (errors.length === 0) {
            console.log(colors.green('\n✅ Validation passed!'));
            console.log(colors.blue(`📊 Files checked: ${requiredFiles.length}`));
            console.log(colors.yellow(`⚠️  Warnings: ${warnings.length}`));
        } else {
            process.exit(1);
        }
        
    } catch (error) {
        console.error(colors.red('❌ Validation failed:'), error.message);
        process.exit(1);
    }

    async function validateHTML() {
        const indexPath = path.join(__dirname, '..', 'index.html');
        const content = await fs.readFile(indexPath, 'utf8');
        
        if (!content.includes('<!DOCTYPE html>')) {
            errors.push('index.html: Missing DOCTYPE declaration');
        }
        
        if (!content.includes('<html lang="de">')) {
            warnings.push('index.html: Missing or incorrect lang attribute');
        }
        
        if (!content.includes('viewport')) {
            errors.push('index.html: Missing viewport meta tag');
        }
        
        console.log(colors.green('✓ HTML structure validated'));
    }

    async function validateCSS() {
        const cssPath = path.join(__dirname, '..', 'styles.css');
        const content = await fs.readFile(cssPath, 'utf8');
        
        if (!content.includes(':root')) {
            warnings.push('styles.css: No CSS custom properties found');
        }
        
        if (!content.includes('@media')) {
            warnings.push('styles.css: No responsive media queries found');
        }
        
        console.log(colors.green('✓ CSS validated'));
    }

    async function validateJS() {
        const jsPath = path.join(__dirname, '..', 'script.js');
        const content = await fs.readFile(jsPath, 'utf8');
        
        if (!content.includes('serviceWorker')) {
            warnings.push('script.js: Service Worker registration not found');
        }
        
        console.log(colors.green('✓ JavaScript validated'));
    }

    async function validateManifest() {
        const manifestPath = path.join(__dirname, '..', 'manifest.json');
        
        try {
            const manifest = await fs.readJson(manifestPath);
            
            if (!manifest.name) errors.push('manifest.json: Missing name');
            if (!manifest.start_url) errors.push('manifest.json: Missing start_url');
            if (!manifest.icons || manifest.icons.length === 0) {
                warnings.push('manifest.json: No icons defined');
            }
            
            console.log(colors.green('✓ PWA Manifest validated'));
        } catch (e) {
            errors.push('manifest.json: Invalid JSON');
        }
    }

    async function validateAdmin() {
        const adminPath = path.join(__dirname, '..', 'admin', 'admin-script.js');
        const content = await fs.readFile(adminPath, 'utf8');
        
        if (!content.includes('class AdminPanel')) {
            errors.push('admin-script.js: AdminPanel class not found');
        }
        
        if (!content.includes('localStorage')) {
            warnings.push('admin-script.js: No localStorage usage found');
        }
        
        console.log(colors.green('✓ Admin Panel validated'));
    }
}

validate();
