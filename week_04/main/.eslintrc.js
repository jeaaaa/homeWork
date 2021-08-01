module.exports = {
    root: false,
    env: {
        browser: true,
        node: true
    },
    extends: [
        // "plugin:vue/vue3-essential",
        // "@vue/airbnb",
        // "@vue/typescript/recommended"
    ],
    parserOptions: {
        "ecmaVersion": 2020
    },
    // add your custom rules here
    rules: {
        "semi": false,
        "indent": [0, 4],

    }
}

