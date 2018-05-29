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
      __static: true
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
        // tab indentation
        'indent': [1, "tab"],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always", { "omitLastInOneLineBlock": true}
        ],
        // allow paren-less arrow functions
        'arrow-parens': 0,
        'space-before-function-paren': ["error", "never"]
    }
};
