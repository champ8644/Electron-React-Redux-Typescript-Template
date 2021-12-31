module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    allowImportExportEverywhere: true,
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
      ts: true,
      tsx: true
    }
  },
  globals: {
    Platform: 'writable',
    ErrorUtils: 'writable'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    'jest/globals': true
  },
  plugins: ['promise', 'node', 'react', '@typescript-eslint', 'prettier', 'jest', 'react-hooks'],
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'prettier',
    'plugin:@typescript-eslint/recommended'
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      'react-native': { platform: 'both' },
      alias: [
        ['@root', '.'],
        ['@app', './app'],
        ['@svgs', './app/assets/svgs'],
        ['@sounds', './app/assets/sounds'],
        ['@fonts', './app/assets/fonts']
      ]
    },
    node: {
      tryExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
    }
  },
  rules: {
    'import/no-import-module-exports': 'off',
    'prefer-spread': 'off',
    'default-param-last': 'off',
    'no-constant-condition': 'off',
    'react/function-component-definition': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'react/no-unused-prop-types': 'off',
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        allowDestructuring: true, // Allow `const { props, state } = this`; false by default
        allowedNames: ['self'] // Allow `const self = this`; `[]` by default
      }
    ],
    'react/jsx-pascal-case': 'off',
    'import/no-mutable-exports': 'off',
    'react/static-property-placement': 'off',
    'react/no-array-index-key': 'off',
    'react/no-did-mount-set-state': 'off',
    'no-control-regex': 'off',
    'no-unused-expressions': 'off',
    'import/export': 'off',
    'global-require': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
    'import/no-extraneous-dependencies': 'off',
    'dot-notation': 'off',
    curly: 'off',
    'consistent-return': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    'react/require-default-props': 'off',
    camelcase: 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    // '@typescript-eslint/no-unused-vars-experimental': [
    //   'warn',
    //   {
    //     ignoreArgsIfArgsAfterAreUsed: true,
    //     ignoredNamesRegex: '^(theme|props|state|ownProps|dispatch|getState|payload)|_'
    //   }
    // ],
    'no-unused-vars': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    // 'react/jsx-filename-extension': [
    //   2,
    //   { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
    // ],
    'no-throw-literal': 'off',
    'jest/no-focused-tests': 'warn',
    'import/no-nodejs-modules': 'off',
    'no-console': 'off',
    'import/extensions': 'off',
    'node/file-extension-in-import': [
      'warn',
      'always',
      {
        tryExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        '.tsx': 'never',
        '.ts': 'never',
        '.jsx': 'never',
        '.js': 'never'
      }
    ],
    'import/order': 'off',
    'react/prefer-stateless-function': 'off',
    'react/style-prop-object': 'off',
    'react/prop-types': 'off',
    'react/jsx-no-bind': 'off',
    'max-classes-per-file': 'off',
    'no-plusplus': 'off',
    'react/sort-comp': 'off',
    'no-underscore-dangle': 'off',
    'import/no-commonjs': 'off',
    eqeqeq: 'off',
    'no-alert': 'off',
    'no-use-before-define': 'off',
    'react-native/no-color-literals': 'off',
    'react-native/no-inline-styles': 'off',
    'react/no-multi-comp': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/destructuring-assignment': 'off',
    'import/no-namespace': 'off',
    'class-methods-use-this': 'off',
    'react-native/no-unused-styles': 'off',
    'no-lone-blocks': 'off',
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'no-else-return': 'off',
    'import/prefer-default-export': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'lines-between-class-members': 'off',
    'no-await-in-loop': 'off',
    'no-cond-assign': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'no-lonely-if': 'off',
    'no-continue': 'off',
    'react/no-did-update-set-state': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'guard-for-in': 'off',
    'no-empty': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-handler-names': 'off',
    'no-restricted-properties': 'off'
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: {
        'consistent-return': 'warn',
        'no-useless-constructor': 'warn',
        '@typescript-eslint/no-useless-constructor': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-vars': [
          'warn',
          {
            args: 'after-used',
            argsIgnorePattern: '^(theme|props|state|ownProps|dispatch|getState|payload)|_'
          }
        ],
        '@typescript-eslint/no-unused-vars-experimental': 'off',
        '@typescript-eslint/adjacent-overload-signatures': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': 'off',
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-extra-non-null-assertion': 'off',
        'no-extra-semi': 'off',
        '@typescript-eslint/no-extra-semi': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-misused-new': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/prefer-as-const': 'off',
        '@typescript-eslint/prefer-namespace-keyword': 'off',
        '@typescript-eslint/triple-slash-reference': 'off'
      }
    }
  ]
};
