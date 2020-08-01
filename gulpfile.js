const gulp = require('gulp');
const server = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemap = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const del = require('del');
const imagemin = require('gulp-imagemin');
const svgstore = require('gulp-svgstore');
const cheerio = require('gulp-cheerio');
const svgmin = require('gulp-svgmin');

gulp.task('clean', () => del('dist'));

gulp.task('css', () => gulp.src('app/scss/main.scss')
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(sass())
  .pipe(rename('main.css'))
  .pipe(sourcemap.write('.'))
  .pipe(gulp.dest('dist/css'))
  .pipe(server.stream()));

gulp.task('html', () => gulp
  .src('app/*.html')
  .pipe(gulp.dest('dist'))
  .pipe(server.stream()));

gulp.task('scripts', () => gulp
  .src('app/js/**/*.js')
  .pipe(gulp.dest('dist/js'))
  .pipe(server.stream()));

gulp.task('images', () => gulp
  .src('app/assets/images/**/*.+(png|jpg|jpeg)')
  .pipe(imagemin([imagemin.mozjpeg({
    quality: 75,
    progressive: true,
  }),
  imagemin.optipng({ optimizationLevel: 5 })]))
  .pipe(gulp.dest('dist/assets/images')));

gulp.task('fonts', () => gulp.src('app/assets/fonts/**/*.+(woff|woff2)')
  .pipe(gulp.dest('dist/assets/fonts'))
  .pipe(server.stream()));

gulp.task('sprite', () => gulp
  .src('app/assets/images/icons/**/*.svg')
  .pipe(svgmin({
    js2svg: {
      pretty: true,
    },
  }))
  .pipe(cheerio({
    run($) {
      $('[fill]')
        .removeAttr('fill');
      $('[stroke]')
        .removeAttr('stroke');
      $('[style]')
        .removeAttr('style');
    },
    parserOptions: { xmlMode: true },
  }))
  .pipe(
    svgstore({
      inlineSvg: true,
    }),
  )
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('dist/assets/images/sprite'))
  .pipe(server.stream()));

gulp.task('server', () => {
  server.init({
    server: 'dist/',
  });
  gulp.watch('app/*.html', gulp.series('html'));
  gulp.watch('app/scss/**/*.scss', gulp.series('css'));
  gulp.watch('app/**/*.js', gulp.series('scripts'));
  gulp.watch('app/assets/images/**/*.+{png,jpg,jpeg}', gulp.series('images'));
  gulp.watch('app/assets/fonts/**/*.+(woff|woff2)', gulp.series('fonts'));
  gulp.watch('app/assets/images/icons/**/*.svg', gulp.series('sprite'));
});

gulp.task(
  'build',
  gulp.series(
    'clean',
    'html',
    'css',
    'scripts',
    'images',
    'fonts',
    'sprite',
  ),
);

gulp.task('start', gulp.series('build', 'server'));
