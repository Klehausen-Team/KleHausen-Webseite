module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "globals": {
        "logInfo": "readonly",
        "logError": "readonly", 
        "logDebug": "readonly",
        "logSuccess": "readonly",
        "logWarn": "readonly"
    },
    "rules": {
        "no-unused-vars": "warn",
        "no-console": "off"
    }
};
