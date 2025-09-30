const gulp = require("gulp")
const path = require("path")
const del = require("del")
const browserSync = require("browser-sync").create()
const dartSass = require("sass")
const gulpSass = require("gulp-sass")(dartSass)
const postcss = require("gulp-postcss")
const autoprefixer = require("autoprefixer")
const pug = require("gulp-pug")
const { createGulpEsbuild } = require("gulp-esbuild")

const esbuild = createGulpEsbuild({})

const SRC = "./src"
const DEST = "."

const paths = {
  pug: {
    src: path.join(SRC, "pug/**/*.pug"),
    entry: path.join(SRC, "pug/index.pug"),
    dest: DEST,
  },
  styles: {
    src: path.join(SRC, "scss/**/*.scss"),
    entry: path.join(SRC, "scss/style.scss"),
    dest: path.join(DEST, "css"),
  },
  scripts: {
    src: path.join(SRC, "js/**/*.ts"),
    entry: path.join(SRC, "js/main.ts"),
    dest: path.join(DEST, "js"),
  },
}

function clean() {
  return del([
    path.join(paths.styles.dest, "**/*"),
    path.join(paths.scripts.dest, "**/*"),
    path.join(DEST, "index.html"),
  ])
}

function html() {
  return gulp
    .src(paths.pug.entry)
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browserSync.stream())
}

function styles() {
  return gulp
    .src(paths.styles.entry, { sourcemaps: true })
    .pipe(gulpSass().on("error", gulpSass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(paths.styles.dest, { sourcemaps: "." }))
    .pipe(browserSync.stream())
}

function scripts() {
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

function serve() {
  return browserSync.init({
    server: { baseDir: DEST },
    open: false,
    notify: false,
  })
}

function watch() {
  gulp.watch(paths.styles.src, gulp.series(styles))
  gulp.watch(paths.scripts.src, gulp.series(scripts))
  gulp.watch(paths.pug.src, gulp.series(html))
}

const build = gulp.series(gulp.parallel(html, styles, scripts))
const dev = gulp.series(build, serve, watch)

exports.clean = clean
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.build = build
exports.dev = dev
exports.default = dev
