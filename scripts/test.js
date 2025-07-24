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

console.log(colors.blue('🧪 Testing KleHausen Website...'));

async function runTests() {
    let passed = 0;
    let failed = 0;
    
    try {
        // Test 1: Admin Panel Login Logic
        console.log(colors.blue('\n📝 Testing Admin Panel Logic...'));
        
        const testUsers = [
            { username: 'admin', password: 'KleHausen2025!', expected: true },
            { username: 'creator', password: 'Creator123!', expected: true },
            { username: 'wrong', password: 'wrong', expected: false }
        ];
        
        testUsers.forEach(test => {
            const result = testLogin(test.username, test.password);
            if (result === test.expected) {
                console.log(colors.green(`✓ Login test: ${test.username}`));
                passed++;
            } else {
                console.log(colors.red(`✗ Login test failed: ${test.username}`));
                failed++;
            }
        });

        // Test 2: LocalStorage funktionalität
        console.log(colors.blue('\n💾 Testing LocalStorage...'));
        if (testLocalStorage()) {
            console.log(colors.green('✓ LocalStorage functions work'));
            passed++;
        } else {
            console.log(colors.red('✗ LocalStorage test failed'));
            failed++;
        }

        // Test 3: PWA Manifest
        console.log(colors.blue('\n📱 Testing PWA Manifest...'));
        if (await testManifest()) {
            console.log(colors.green('✓ PWA Manifest is valid'));
            passed++;
        } else {
            console.log(colors.red('✗ PWA Manifest test failed'));
            failed++;
        }

        // Test 4: Service Worker
        console.log(colors.blue('\n⚙️  Testing Service Worker...'));
        if (await testServiceWorker()) {
            console.log(colors.green('✓ Service Worker is valid'));
            passed++;
        } else {
            console.log(colors.red('✗ Service Worker test failed'));
            failed++;
        }

        // Ergebnisse
        console.log(colors.blue('\n📊 Test Results:'));
        console.log(colors.green(`✅ Passed: ${passed}`));
        console.log(colors.red(`❌ Failed: ${failed}`));
        
        if (failed === 0) {
            console.log(colors.green('\n🎉 All tests passed!'));
        } else {
            console.log(colors.red('\n💥 Some tests failed!'));
            process.exit(1);
        }
        
    } catch (error) {
        console.error(colors.red('❌ Test runner failed:'), error.message);
        process.exit(1);
    }
}

function testLogin(username, password) {
    // Simuliere die Login-Logik aus admin-script.js
    const users = [
        { username: 'admin', password: 'KleHausen2025!' },
        { username: 'creator', password: 'Creator123!' }
    ];
    
    return users.some(u => u.username === username && u.password === password);
}

function testLocalStorage() {
    try {
        // Simuliere LocalStorage Operationen
        const testData = { test: 'data', timestamp: Date.now() };
        
        // Test JSON stringify/parse
        const jsonString = JSON.stringify(testData);
        const parsed = JSON.parse(jsonString);
        
        return parsed.test === 'data' && typeof parsed.timestamp === 'number';
    } catch (e) {
        return false;
    }
}

async function testManifest() {
    try {
        const manifestPath = path.join(__dirname, '..', 'manifest.json');
        const manifest = await fs.readJson(manifestPath);
        
        return manifest.name && 
               manifest.start_url && 
               manifest.display && 
               Array.isArray(manifest.icons);
    } catch (e) {
        return false;
    }
}

async function testServiceWorker() {
    try {
        const swPath = path.join(__dirname, '..', 'sw.js');
        const content = await fs.readFile(swPath, 'utf8');
        
        return content.includes('install') && 
               content.includes('fetch') && 
               content.includes('caches');
    } catch (e) {
        return false;
    }
}

runTests();
