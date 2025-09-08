module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    'unicode-bom': 'off',
    'no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/img-redundant-alt': 'warn',
    'eqeqeq': 'warn'
  }
};