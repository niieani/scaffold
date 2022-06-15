"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJSON = exports.getTargetNodeRuntime = exports.getRootTSConfig = exports.getRootProjectReferences = exports.getRootPackageJSON = exports.getPackageVersion = exports.TS_PATH_PREFIX_REGEX = exports.TSCONFIG_JSON_PATH = exports.TEST_UTILS_GLOB = exports.TEST_FILES_GLOB = exports.TESTS_LIST = exports.SOURCE_FILES_GLOB = exports.ROOT = exports.PACKAGE_JSON_PATH = exports.NON_JS_REGEX = exports.IGNORE_LIST = exports.EXTENSIONS_WITHOUT_DOT = exports.EXTENSIONS_PATTERN = exports.EXTENSIONS = exports.ECMA_VERSION = exports.CASE_SENSITIVE = exports.ALL_JS_REGEX = exports.ALL_FILES_GLOB = void 0;
const config_constants_1 = require("@beemo/config-constants");
Object.defineProperty(exports, "ALL_JS_REGEX", { enumerable: true, get: function () { return config_constants_1.ALL_JS_REGEX; } });
Object.defineProperty(exports, "CASE_SENSITIVE", { enumerable: true, get: function () { return config_constants_1.CASE_SENSITIVE; } });
Object.defineProperty(exports, "ECMA_VERSION", { enumerable: true, get: function () { return config_constants_1.ECMA_VERSION; } });
Object.defineProperty(exports, "EXTENSIONS", { enumerable: true, get: function () { return config_constants_1.EXTENSIONS; } });
Object.defineProperty(exports, "EXTENSIONS_PATTERN", { enumerable: true, get: function () { return config_constants_1.EXTENSIONS_PATTERN; } });
Object.defineProperty(exports, "EXTENSIONS_WITHOUT_DOT", { enumerable: true, get: function () { return config_constants_1.EXTENSIONS_WITHOUT_DOT; } });
Object.defineProperty(exports, "IGNORE_LIST", { enumerable: true, get: function () { return config_constants_1.IGNORE_LIST; } });
Object.defineProperty(exports, "NON_JS_REGEX", { enumerable: true, get: function () { return config_constants_1.NON_JS_REGEX; } });
Object.defineProperty(exports, "PACKAGE_JSON_PATH", { enumerable: true, get: function () { return config_constants_1.PACKAGE_JSON_PATH; } });
Object.defineProperty(exports, "ROOT", { enumerable: true, get: function () { return config_constants_1.ROOT; } });
Object.defineProperty(exports, "TSCONFIG_JSON_PATH", { enumerable: true, get: function () { return config_constants_1.TSCONFIG_JSON_PATH; } });
Object.defineProperty(exports, "TS_PATH_PREFIX_REGEX", { enumerable: true, get: function () { return config_constants_1.TS_PATH_PREFIX_REGEX; } });
Object.defineProperty(exports, "getPackageVersion", { enumerable: true, get: function () { return config_constants_1.getPackageVersion; } });
Object.defineProperty(exports, "getRootPackageJSON", { enumerable: true, get: function () { return config_constants_1.getRootPackageJSON; } });
Object.defineProperty(exports, "getRootProjectReferences", { enumerable: true, get: function () { return config_constants_1.getRootProjectReferences; } });
Object.defineProperty(exports, "getRootTSConfig", { enumerable: true, get: function () { return config_constants_1.getRootTSConfig; } });
Object.defineProperty(exports, "getTargetNodeRuntime", { enumerable: true, get: function () { return config_constants_1.getTargetNodeRuntime; } });
Object.defineProperty(exports, "parseJSON", { enumerable: true, get: function () { return config_constants_1.parseJSON; } });
const ALL_FILES_GLOB = `**/{src,tests,__tests__}/**/!(*.d).{${config_constants_1.EXTENSIONS_PATTERN}}`;
exports.ALL_FILES_GLOB = ALL_FILES_GLOB;
const SOURCE_FILES_GLOB = `**/src/**/*!(*.d).{${config_constants_1.EXTENSIONS_PATTERN}}`;
exports.SOURCE_FILES_GLOB = SOURCE_FILES_GLOB;
const TEST_FILES_GLOB = `**/{tests,__tests__}/**/*.test!(*.d).{${config_constants_1.EXTENSIONS_PATTERN}}`;
exports.TEST_FILES_GLOB = TEST_FILES_GLOB;
const TEST_UTILS_GLOB = `**/{tests,__tests__}/**/!(*.d).{${config_constants_1.EXTENSIONS_PATTERN}}`; // List of globs to find all test related files
exports.TEST_UTILS_GLOB = TEST_UTILS_GLOB;
const TESTS_LIST = [
    TEST_FILES_GLOB,
    TEST_UTILS_GLOB,
    `**/*.test!(*.d).{${config_constants_1.EXTENSIONS_PATTERN}}`,
]; // Pattern of file extensions
exports.TESTS_LIST = TESTS_LIST;
