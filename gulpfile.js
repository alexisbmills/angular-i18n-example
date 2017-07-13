/*************************************
 * Requires
 *************************************/
const gulp = require("gulp");
const rename = require("gulp-rename");
const modifyFile = require("gulp-modify-file");
const async = require("async");
const cheerio = require("gulp-cheerio");
const pd = require("pretty-data").pd;
const removeEmptyLines = require('gulp-remove-empty-lines');

/*************************************
 * Functions
 *************************************/
function copyArray(source) {
  const copy = [];
  for (elem of source) {
    copy.push(elem);
  }
  return copy;
}

function getNodeIndexFromNodeList(nodeList, node) {
  for (let i = 0, iLen = nodeList.length; i < iLen; i++) {
    if (nodeList[i].attr("id") === node.attr("id")) {
      return i;
    }
  }
  return -1;
}

function removeNodeFromList(nodeList, node) {
  return nodeList.splice(getNodeIndexFromNodeList(nodeList, node), 1);
}

/*************************************
 * Constants
 *************************************/
const PATH_I18N_LANGUAGES = "./src/locale";
const FILE_SOURCE_I18N = "./src/messages.xlf";
const XLF_MASK = "/*.xlf";

/*************************************
 * Variables
 *************************************/
const currentNodes = [];

/*************************************
 * Tasks
 *************************************/

/**
 * Create translation files for languages passed as arguments from source translation file
 * It must be run after extracting i18n labels from templates "node_modules/.bin/ng-xi18n"
 *
 * Sample: gulp i18n-init --languages "es, en, de, fr"
 */
gulp.task("i18n-init", function (done) {
  console.log("Creating translation files...");

  if (5 > process.argv.length) {
    throw new Error('Not enough arguments. Sample: gulp i18n-init --languages "es, en, de, fr"');
  }

  const tasks = [];
  const languages = process.argv[4].replace(/\s+/g, "").split(",");

  for (let i = 0; i < languages.length; i++) {
    tasks.push(function () {
      const language = languages[i];
      return function (callback) {
        gulp.src(FILE_SOURCE_I18N)
          .pipe(rename(function (path) {
            path.basename = "messages." + language;
            console.log("==>", PATH_I18N_LANGUAGES + "/" + path.basename + path.extname);
          }))
          .pipe(gulp.dest(PATH_I18N_LANGUAGES))
          .on("end", callback)
      }
    }());
  }
  async.parallel(tasks, done);
});

/**
 * Process source translation file to generate a list of its nodes
 * It must be run before "i18n-update:merge" task
 */
gulp.task("i18n-update:init", function () {
  console.log("Processing source file...");

  return gulp.src(FILE_SOURCE_I18N)
    .pipe(cheerio({
      run: function ($, file) {
        $("trans-unit").each(function () {
          const node = $(this);
          currentNodes.push(node);
        });
        console.log("==>", file.path);
      }
      ,
      parserOptions: {
        xmlMode: true
      }
    }))
});

/**
 * Merge source translation file with existing ones
 * Remove unused nodes (not in source)
 * Keep nodes intersection
 * It must be run after "i18n-update:init" task
 */
gulp.task("i18n-update:merge", ["i18n-update:init"], function () {
  console.log("Processing translation files...");

  return gulp.src(PATH_I18N_LANGUAGES + XLF_MASK)
    .pipe(cheerio({
      run: function ($, file) {
        const transNodes = copyArray(currentNodes);

        $("trans-unit").each(function () {
          const node = $(this);

          if (-1 === getNodeIndexFromNodeList(transNodes, node)) {
            node.remove();

          } else {
            removeNodeFromList(transNodes, node);
          }
        });

        for (elem of transNodes) {
          $("body").append(elem);
        }
        console.log("==>", file.path);
      }
      ,
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(modifyFile(function (content) {
      return pd.xml(content)
    }))
    .pipe(removeEmptyLines())
    .pipe(gulp.dest(PATH_I18N_LANGUAGES));
});

/**
 * Task pipe to init & merge i18n translation files
 */
gulp.task("i18n-update", ["i18n-update:merge", "i18n-update:init"]);