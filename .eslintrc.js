module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module'
    },
    "env": {
        "es6": true,
        "node": true
    },
    "extends": ["standard", "eslint:recommended", "plugin:react/recommended"],
    globals: {
      __static: true,
      atom: true
    },
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "strict": 0,
        // tab indentation
        'indent': ["warn", 4],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "warn",
            "always", { "omitLastInOneLineBlock": true}
        ],
        // allow paren-less arrow functions
        'arrow-parens': 0,
        'space-before-function-paren': ["error", "never"],
        'no-console': ["error", { allow: ["warn", "error", "log"] }]
    }
};
