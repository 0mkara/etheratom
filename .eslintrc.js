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
    "extends": ["standard", "eslint:recommended", "plugin:react/recommended", 'plugin:import/errors', 'plugin:import/warnings'],
    globals: {
      __static: true,
      atom: true
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "settings": {
        "react": {
            "version": "16.4.2"
        }
    },
    "plugins": [
        "react",
        "babel",
        "import"
    ],
    "rules": {
        "strict": 0,
        "babel/semi": 1,
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
        // allow paren-less arrow functions
        'arrow-parens': 0,
        'space-before-function-paren': ["error", "never"],
        'no-console': ["error", { allow: ["warn", "error", "log"] }],
        'import/named': 2,
        'import/namespace': 2,
        'import/default': 2,
        'import/export': 2,
        'import/no-unresolved': 'off'
    }
};
