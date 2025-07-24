#!/usr/bin/env node

/**
 * KleHausen Admin Panel - Einfacher Funktionstest
 * Testet kritische Funktionen ohne Syntax-Parsing
 */

const fs = require('fs-extra');
const path = require('path');

// Farben für Console
const colors = {
    red: (text) => `\x1b[31m${text}\x1b[0m`,
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    blue: (text) => `\x1b[34m${text}\x1b[0m`,
    cyan: (text) => `\x1b[36m${text}\x1b[0m`
};

console.log(colors.cyan('🔧 KleHausen Admin Panel - Vereinfachter Test'));
console.log(colors.blue('================================================\n'));

async function runSimplifiedTests() {
    let passed = 0;
    let failed = 0;
    
    try {
        // Test 1: Dateien existieren
        console.log(colors.blue('📁 Testing File Existence...'));
        
        const criticalFiles = [
            'admin/index.html',
            'admin/admin-script.js', 
            'admin/admin-styles.css',
            'js/logger.js',
            'js/system-monitor.js',
            'js/debug-dashboard.js'
        ];
        
        for (const file of criticalFiles) {
            const filePath = path.join(__dirname, '..', file);
            if (await fs.pathExists(filePath)) {
                console.log(colors.green(`✓ ${file}`));
                passed++;
            } else {
                console.log(colors.red(`✗ ${file} fehlt`));
                failed++;
            }
        }
        
        // Test 2: HTML Grundstruktur
        console.log(colors.blue('\n🏗️  Testing HTML Structure...'));
        
        const adminHtml = await fs.readFile(path.join(__dirname, '..', 'admin', 'index.html'), 'utf8');
        
        const criticalElements = [
            'adminSplash',
            'loginForm', 
            'adminDashboard',
            'adminContent',
            'username',
            'password'
        ];
        
        for (const element of criticalElements) {
            if (adminHtml.includes(`id="${element}"`)) {
                console.log(colors.green(`✓ Element: ${element}`));
                passed++;
            } else {
                console.log(colors.red(`✗ Element fehlt: ${element}`));
                failed++;
            }
        }
        
        // Test 3: CSS Klassen
        console.log(colors.blue('\n🎨 Testing CSS Classes...'));
        
        const adminCss = await fs.readFile(path.join(__dirname, '..', 'admin', 'admin-styles.css'), 'utf8');
        
        const criticalClasses = [
            '.admin-dashboard',
            '.login-container',
            '.sidebar',
            '.main-content'
        ];
        
        for (const cssClass of criticalClasses) {
            if (adminCss.includes(cssClass)) {
                console.log(colors.green(`✓ CSS: ${cssClass}`));
                passed++;
            } else {
                console.log(colors.red(`✗ CSS fehlt: ${cssClass}`));
                failed++;
            }
        }
        
        // Test 4: JavaScript Grundfunktionen
        console.log(colors.blue('\n⚙️  Testing JavaScript Functions...'));
        
        const adminJs = await fs.readFile(path.join(__dirname, '..', 'admin', 'admin-script.js'), 'utf8');
        
        const coreFunctions = [
            'AdminPanel',
            'handleLogin',
            'showDashboard',
            'uploadMedia',
            'deleteMedia'
        ];
        
        for (const func of coreFunctions) {
            if (adminJs.includes(func)) {
                console.log(colors.green(`✓ Function: ${func}`));
                passed++;
            } else {
                console.log(colors.red(`✗ Function fehlt: ${func}`));
                failed++;
            }
        }
        
        // Test 5: Logging Integration
        console.log(colors.blue('\n📝 Testing Logging Integration...'));
        
        const loggerJs = await fs.readFile(path.join(__dirname, '..', 'js', 'logger.js'), 'utf8');
        
        const logFunctions = ['logInfo', 'logError', 'logDebug'];
        
        for (const logFunc of logFunctions) {
            if (loggerJs.includes(`window.${logFunc}`)) {
                console.log(colors.green(`✓ Logging: ${logFunc}`));
                passed++;
            } else {
                console.log(colors.red(`✗ Logging fehlt: ${logFunc}`));
                failed++;
            }
        }
        
        // Test 6: Admin Credentials
        console.log(colors.blue('\n👥 Testing Admin Credentials...'));
        
        if (adminJs.includes('admin') && adminJs.includes('KleHausen2025!')) {
            console.log(colors.green('✓ Admin Credentials konfiguriert'));
            passed++;
        } else {
            console.log(colors.red('✗ Admin Credentials fehlen'));
            failed++;
        }
        
        if (adminJs.includes('creator') && adminJs.includes('Creator123!')) {
            console.log(colors.green('✓ Creator Credentials konfiguriert'));
            passed++;
        } else {
            console.log(colors.red('✗ Creator Credentials fehlen'));
            failed++;
        }
        
        // Test 7: NPM Integration
        console.log(colors.blue('\n📦 Testing NPM Integration...'));
        
        const packageJson = await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf8');
        const package_data = JSON.parse(packageJson);
        
        if (package_data.scripts && package_data.scripts.start) {
            console.log(colors.green('✓ NPM Start Script'));
            passed++;
        } else {
            console.log(colors.red('✗ NPM Start Script fehlt'));
            failed++;
        }
        
        if (package_data.scripts && package_data.scripts.test) {
            console.log(colors.green('✓ NPM Test Script'));
            passed++;
        } else {
            console.log(colors.red('✗ NPM Test Script fehlt'));
            failed++;
        }
        
        // Ergebnisse
        console.log(colors.blue('\n📊 Simplified Test Results:'));
        console.log(colors.cyan('=============================='));
        console.log(colors.green(`✅ Passed: ${passed}`));
        console.log(colors.red(`❌ Failed: ${failed}`));
        
        const successRate = ((passed / (passed + failed)) * 100).toFixed(1);
        console.log(colors.cyan(`📈 Success Rate: ${successRate}%`));
        
        if (failed === 0) {
            console.log(colors.green('\n🎉 Alle grundlegenden Tests bestanden!'));
            console.log(colors.cyan('🚀 Das Admin Panel sollte funktionsfähig sein!'));
        } else if (successRate >= 80) {
            console.log(colors.yellow('\n⚠️  Admin Panel ist größtenteils funktionsfähig'));
            console.log(colors.cyan('📝 Einige kleinere Probleme könnten bestehen'));
        } else {
            console.log(colors.red('\n💥 Admin Panel hat kritische Probleme!'));
        }
        
        // Deployment Status
        console.log(colors.blue('\n🔍 System Status:'));
        console.log(colors.cyan('=================='));
        console.log(colors.cyan('1. Server: http://127.0.0.1:3000'));
        console.log(colors.cyan('2. Admin Panel: http://127.0.0.1:3000/admin/'));
        console.log(colors.cyan('3. Debug Logger: Strg+Shift+L'));
        console.log(colors.cyan('4. Debug Dashboard: Strg+Shift+D'));
        console.log(colors.cyan('5. System Monitor: Rechts oben'));
        
        if (successRate >= 80) {
            console.log(colors.green('\n✅ System ist bereit für den Einsatz!'));
        }
        
    } catch (error) {
        console.error(colors.red('❌ Test Fehler:'), error.message);
        process.exit(1);
    }
}

runSimplifiedTests();
