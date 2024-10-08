import globals from "globals"
import eslint from "@eslint/js"
import mocha from "eslint-plugin-mocha"

export default [
    eslint.configs.recommended,
    mocha.configs.flat.recommended,
    {
        "languageOptions": {
            "sourceType": "commonjs",
            "ecmaVersion": 11,
            "globals": {
                ...globals.node,
                "Atomics": "readonly",
                "SharedArrayBuffer": "readonly"
            }
        },
        "rules": {
            "no-unused-vars": "off"
        },
        "ignores": ["eslint.config.mjs"]
    }
]