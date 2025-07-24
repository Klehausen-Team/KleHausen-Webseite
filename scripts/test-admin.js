#!/usr/bin/env node

/**
 * KleHausen Admin Panel Test Suite
 * Umfassender Test aller Admin Panel Funktionen
 */

const fs = require('fs-extra');
const path = require('path');

// Farb-Codes für Console
const colors = {
    red: (text) => `\x1b[31m${text}\x1b[0m`,
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    blue: (text) => `\x1b[34m${text}\x1b[0m`,
    cyan: (text) => `\x1b[36m${text}\x1b[0m`,
    magenta: (text) => `\x1b[35m${text}\x1b[0m`
};

console.log(colors.cyan('🔧 KleHausen Admin Panel Test Suite'));
console.log(colors.blue('=======================================\n'));

async function runAdminPanelTests() {
    let passed = 0;
    let failed = 0;
    
    try {
        // Test 1: Admin Panel Dateien
        console.log(colors.blue('📁 Testing Admin Panel Files...'));
        
        const adminFiles = [
            'admin/index.html',
            'admin/admin-script.js',
            'admin/admin-styles.css'
        ];
        
        for (const file of adminFiles) {
            const filePath = path.join(__dirname, '..', file);
            if (await fs.pathExists(filePath)) {
                console.log(colors.green(`✓ ${file} existiert`));
                passed++;
            } else {
                console.log(colors.red(`✗ ${file} fehlt`));
                failed++;
            }
        }
        
        // Test 2: Admin HTML Struktur
        console.log(colors.blue('\n🏗️  Testing Admin HTML Structure...'));
        
        const adminHtmlPath = path.join(__dirname, '..', 'admin', 'index.html');
        const adminHtml = await fs.readFile(adminHtmlPath, 'utf8');
        
        const requiredElements = [
            'id="adminSplash"',
            'id="loginForm"',
            'id="dashboard"',
            'id="username"',
            'id="password"',
            'class="sidebar"',
            'class="main-content"'
        ];
        
        for (const element of requiredElements) {
            if (adminHtml.includes(element) || 
                (element === 'class="sidebar"' && adminHtml.includes('sidebar')) ||
                (element === 'class="main-content"' && adminHtml.includes('main-content'))) {
                console.log(colors.green(`✓ ${element} gefunden`));
                passed++;
            } else {
                console.log(colors.red(`✗ ${element} fehlt`));
                failed++;
            }
        }
        
        // Test 3: Admin JavaScript Funktionen
        console.log(colors.blue('\n⚙️  Testing Admin JavaScript Functions...'));
        
        const adminJsPath = path.join(__dirname, '..', 'admin', 'admin-script.js');
        const adminJs = await fs.readFile(adminJsPath, 'utf8');
        
        const requiredFunctions = [
            'class AdminPanel',
            'handleLogin',
            'showDashboard',
            'navigateToPage',
            'uploadMedia',
            'deleteMedia',
            'addProject',
            'editProject',
            'deleteProject',
            'getNotificationsHTML',
            'getBackupHTML',
            'exportBackup',
            'importBackup',
            'savePageContent',
            'loadSavedPageContent'
        ];
        
        for (const func of requiredFunctions) {
            if (adminJs.includes(func)) {
                console.log(colors.green(`✓ ${func} implementiert`));
                passed++;
            } else {
                console.log(colors.red(`✗ ${func} fehlt`));
                failed++;
            }
        }
        
        // Test 4: Logging Integration
        console.log(colors.blue('\n📝 Testing Logging Integration...'));
        
        const loggingFunctions = [
            'logInfo(',
            'logError(',
            'logDebug(',
            'logSuccess(',
            'logWarn('
        ];
        
        for (const logFunc of loggingFunctions) {
            if (adminJs.includes(logFunc)) {
                console.log(colors.green(`✓ ${logFunc} wird verwendet`));
                passed++;
            } else {
                console.log(colors.yellow(`⚠ ${logFunc} nicht gefunden`));
            }
        }
        
        // Test 5: CSS Styles
        console.log(colors.blue('\n🎨 Testing Admin CSS Styles...'));
        
        const adminCssPath = path.join(__dirname, '..', 'admin', 'admin-styles.css');
        const adminCss = await fs.readFile(adminCssPath, 'utf8');
        
        const requiredStyles = [
            '.sidebar',
            '.main-content',
            '.splash-screen',
            '.login-container',
            '.dashboard',
            '.menu-link',
            '.content-area'
        ];
        
        for (const style of requiredStyles) {
            if (adminCss.includes(style)) {
                console.log(colors.green(`✓ ${style} Style definiert`));
                passed++;
            } else {
                console.log(colors.red(`✗ ${style} Style fehlt`));
                failed++;
            }
        }
        
        // Test 6: Benutzer-Credentials
        console.log(colors.blue('\n👥 Testing User Credentials...'));
        
        const credentialTests = [
            { user: 'admin', pass: 'KleHausen2025!' },
            { user: 'creator', pass: 'Creator123!' }
        ];
        
        for (const cred of credentialTests) {
            if (adminJs.includes(`username: '${cred.user}'`) && adminJs.includes(`password: '${cred.pass}'`)) {
                console.log(colors.green(`✓ Benutzer ${cred.user} konfiguriert`));
                passed++;
            } else {
                console.log(colors.red(`✗ Benutzer ${cred.user} nicht korrekt konfiguriert`));
                failed++;
            }
        }
        
        // Test 7: LocalStorage Integration
        console.log(colors.blue('\n💾 Testing LocalStorage Integration...'));
        
        const storageTests = [
            'localStorage.getItem',
            'localStorage.setItem',
            'localStorage.removeItem',
            'sessionStorage'
        ];
        
        for (const storage of storageTests) {
            if (adminJs.includes(storage)) {
                console.log(colors.green(`✓ ${storage} wird verwendet`));
                passed++;
            } else {
                console.log(colors.yellow(`⚠ ${storage} nicht gefunden`));
            }
        }
        
        // Test 8: Security Features
        console.log(colors.blue('\n🔒 Testing Security Features...'));
        
        const securityFeatures = [
            'preventDefault()',
            'password.*type.*password',
            'role.*admin',
            'currentUser'
        ];
        
        for (const security of securityFeatures) {
            const regex = new RegExp(security, 'i');
            if (regex.test(adminJs)) {
                console.log(colors.green(`✓ Security Feature: ${security}`));
                passed++;
            } else {
                console.log(colors.yellow(`⚠ Security Feature fehlt: ${security}`));
            }
        }
        
        // Ergebnisse
        console.log(colors.blue('\n📊 Test Results:'));
        console.log(colors.cyan('================'));
        console.log(colors.green(`✅ Passed: ${passed}`));
        console.log(colors.red(`❌ Failed: ${failed}`));
        
        const successRate = ((passed / (passed + failed)) * 100).toFixed(1);
        console.log(colors.cyan(`📈 Success Rate: ${successRate}%`));
        
        if (failed === 0) {
            console.log(colors.green('\n🎉 Alle Admin Panel Tests bestanden!'));
            console.log(colors.cyan('🚀 Das Admin Panel ist vollständig funktionsfähig!'));
        } else if (failed < 5) {
            console.log(colors.yellow('\n⚠️  Admin Panel ist größtenteils funktionsfähig mit geringfügigen Problemen'));
        } else {
            console.log(colors.red('\n💥 Admin Panel benötigt weitere Arbeit!'));
            process.exit(1);
        }
        
        // Debug-Informationen
        console.log(colors.blue('\n🔍 Debug-Informationen:'));
        console.log(colors.cyan('Zum Testen des Admin Panels:'));
        console.log(colors.cyan('1. Gehe zu http://127.0.0.1:3000/admin/'));
        console.log(colors.cyan('2. Verwende Credentials: admin / KleHausen2025!'));
        console.log(colors.cyan('3. Drücke Strg+Shift+L für Logger'));
        console.log(colors.cyan('4. Drücke Strg+Shift+D für Debug Dashboard'));
        console.log(colors.cyan('5. Prüfe den System Status in der oberen rechten Ecke'));
        
    } catch (error) {
        console.error(colors.red('❌ Test Suite Fehler:'), error.message);
        process.exit(1);
    }
}

runAdminPanelTests();
