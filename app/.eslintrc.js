module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: ["eslint:recommended", "plugin:mithril/recommended"],
  parserOptions: {
    ecmaVersion: 11,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "no-irregular-whitespace": 0,
  },
};
