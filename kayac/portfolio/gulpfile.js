import gulp from "gulp"
import { join } from "path"
import { deleteAsync } from "del"
import browserSyncDefault from "browser-sync"
const browserSync = browserSyncDefault.create()
import * as sass from "sass"
import gulpSassDefault from "gulp-sass"
const gulpSass = gulpSassDefault(sass)
import postcss from "gulp-postcss"
import autoprefixer from "autoprefixer"
import pug from "gulp-pug"
import { createGulpEsbuild } from "gulp-esbuild"

const esbuild = createGulpEsbuild({})

const SRC = "./src"
const DEST = "."

const paths = {
  pug: {
    src: join(SRC, "pug/**/*.pug"),
    entry: join(SRC, "pug/index.pug"),
    dest: DEST,
  },
  styles: {
    src: join(SRC, "scss/**/*.scss"),
    entry: join(SRC, "scss/style.scss"),
    dest: join(DEST, "css"),
  },
  scripts: {
    src: join(SRC, "js/**/*.ts"),
    entry: join(SRC, "js/main.ts"),
    dest: join(DEST, "js"),
  },
}

function clean() {
  return deleteAsync([
    join(paths.styles.dest, "**/*"),
    join(paths.scripts.dest, "**/*"),
    join(DEST, "index.html"),
  ])
}

function htmlTask() {
  return gulp
    .src(paths.pug.entry)
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browserSync.stream())
}

function stylesTask() {
  return gulp
    .src(paths.styles.entry, { sourcemaps: true })
    .pipe(gulpSass().on("error", gulpSass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(paths.styles.dest, { sourcemaps: "." }))
    .pipe(browserSync.stream())
}

function scriptsTask() {
  return gulp
    .src(paths.scripts.entry)
    .pipe(
      esbuild({
        outfile: "main.js",
        bundle: true,
        sourcemap: true,
        target: "es2018",
        platform: "browser",
      })
    )
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream())
}

function serveTask() {
  return browserSync.init({
    server: { baseDir: DEST },
    open: false,
    notify: false,
  })
}

function watchTask() {
  gulp.watch(paths.styles.src, gulp.series(stylesTask))
  gulp.watch(paths.scripts.src, gulp.series(scriptsTask))
  gulp.watch(paths.pug.src, gulp.series(htmlTask))
}

const buildTask = gulp.series(gulp.parallel(htmlTask, stylesTask, scriptsTask))
const devTask = gulp.series(buildTask, serveTask, watchTask)
const defaultTask = devTask

export { clean }
export { htmlTask as html }
export { stylesTask as styles }
export { scriptsTask as scripts }
export { buildTask as build }
export { devTask as dev }
export { defaultTask as default }
