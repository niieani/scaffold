import {
  ALL_JS_REGEX,
  CASE_SENSITIVE,
  ECMA_VERSION,
  EXTENSIONS,
  EXTENSIONS_PATTERN,
  EXTENSIONS_WITHOUT_DOT,
  getPackageVersion,
  getRootPackageJSON,
  getRootProjectReferences,
  getRootTSConfig,
  getTargetNodeRuntime,
  IGNORE_LIST as FOLDER_IGNORE_LIST,
  NON_JS_REGEX,
  PACKAGE_JSON_PATH,
  parseJSON,
  ROOT,
  TS_PATH_PREFIX_REGEX,
  TSCONFIG_JSON_PATH,
} from '@beemo/config-constants'

export const ADDITIONAL_IGNORE_LIST = ['*.d.ts', '*.map']
const IGNORE_LIST = FOLDER_IGNORE_LIST.includes(ADDITIONAL_IGNORE_LIST.at(0)!)
  ? FOLDER_IGNORE_LIST
  : [...FOLDER_IGNORE_LIST, ...ADDITIONAL_IGNORE_LIST]

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
  FOLDER_IGNORE_LIST,
  getPackageVersion,
  getRootPackageJSON,
  getRootProjectReferences,
  getRootTSConfig,
  getTargetNodeRuntime,
  IGNORE_LIST,
  NON_JS_REGEX,
  PACKAGE_JSON_PATH,
  parseJSON,
  ROOT,
  SOURCE_FILES_GLOB,
  TEST_FILES_GLOB,
  TEST_UTILS_GLOB,
  TESTS_LIST,
  TS_PATH_PREFIX_REGEX,
  TSCONFIG_JSON_PATH,
}
