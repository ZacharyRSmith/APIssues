/*
.eslintrc.js
*/
const ERROR = 2;
const WARN = 1;

module.exports = {
    extends: "eslint:recommended",
    env: {
        es6: true,
        node: true
    },
    rules: {
        "handle-callback-err": [ERROR, "^.*(e|E)rr"],
        "no-warning-comments": WARN,
        "no-var": ERROR,
        "prefer-const": WARN
    },
    overrides: [
        {
            files: [
                "test/**/*"
            ],
            env: {
                mocha: true // now test files' env has both es6 *and* mocha
            }
            // Can't extend in overrides: https://github.com/eslint/eslint/issues/8813
        }
    ],
};
