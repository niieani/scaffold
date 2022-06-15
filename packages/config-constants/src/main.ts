import {
  ALL_JS_REGEX,
  CASE_SENSITIVE,
  ECMA_VERSION,
  EXTENSIONS,
  EXTENSIONS_PATTERN,
  EXTENSIONS_WITHOUT_DOT,
  IGNORE_LIST,
  NON_JS_REGEX,
  PACKAGE_JSON_PATH,
  ROOT,
  TSCONFIG_JSON_PATH,
  TS_PATH_PREFIX_REGEX,
  getPackageVersion,
  getRootPackageJSON,
  getRootProjectReferences,
  getRootTSConfig,
  getTargetNodeRuntime,
  parseJSON,
} from '@beemo/config-constants'

const ALL_FILES_GLOB = `**/{src,tests,__tests__}/**/!(*.d).{${EXTENSIONS_PATTERN}}`
const SOURCE_FILES_GLOB = `**/src/**/*!(*.d).{${EXTENSIONS_PATTERN}}`
const TEST_FILES_GLOB = `**/{tests,__tests__}/**/*.test!(*.d).{${EXTENSIONS_PATTERN}}`
const TEST_UTILS_GLOB = `**/{tests,__tests__}/**/!(*.d).{${EXTENSIONS_PATTERN}}` // List of globs to find all test related files

const TESTS_LIST = [
  TEST_FILES_GLOB,
  TEST_UTILS_GLOB,
  `**/*.test!(*.d).{${EXTENSIONS_PATTERN}}`,
] // Pattern of file extensions

export {
  ALL_FILES_GLOB,
  ALL_JS_REGEX,
  CASE_SENSITIVE,
  ECMA_VERSION,
  EXTENSIONS,
  EXTENSIONS_PATTERN,
  EXTENSIONS_WITHOUT_DOT,
  IGNORE_LIST,
  NON_JS_REGEX,
  PACKAGE_JSON_PATH,
  ROOT,
  SOURCE_FILES_GLOB,
  TESTS_LIST,
  TEST_FILES_GLOB,
  TEST_UTILS_GLOB,
  TSCONFIG_JSON_PATH,
  TS_PATH_PREFIX_REGEX,
  getPackageVersion,
  getRootPackageJSON,
  getRootProjectReferences,
  getRootTSConfig,
  getTargetNodeRuntime,
  parseJSON,
}
