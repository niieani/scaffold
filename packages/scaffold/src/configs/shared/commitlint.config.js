const OFF = 0
const ERROR = 2

// eslint-disable-next-line import/no-commonjs
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-case': [OFF, 'always'],
    'body-case': [OFF, 'always'],
    'scope-case': [OFF, 'always'],
    'subject-case': [OFF, 'always'],
    'type-case': [OFF, 'always'],
    'header-max-length': [OFF, 'always'],
    'type-enum': [
      ERROR,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'wip',
      ],
    ],
  },
}
