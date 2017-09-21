var gulp = require('gulp'),
plugins  = require('gulp-load-plugins')({
    pattern: '*',
    camelize: true
  }),
options  = { encodeSpecialChars: true },
builder  = plugins.emailBuilder(options),
spawn    = require('child_process').spawn;

var dir      = 'llb',
    campaign = '../campaigns/' + dir + '/',
    temp     = campaign + 'temp/',
    html     = campaign + 'html/*.html',
    inc      = campaign + 'html/inc/*.html',
    sass     = campaign + 'styles/sass/**/*.scss',
    css      = campaign + 'styles/css/*.css',
    dist     = campaign + 'dist/';

// SASS
gulp.task('sass', function() {
  return gulp.src(campaign + 'styles/sass/styles.scss')
    .pipe(plugins.plumber())
    .pipe(plugins.sassGlob())
    .pipe(plugins.sass({
      outputStyle: 'expanded'
    }))
    .pipe(gulp.dest(temp));
});

// PARTIALS
gulp.task('partials', ['sass'], function() {
  return gulp.src(html)
    .pipe(plugins.fileInclude({
      prefix: '@@',
      indent: true
    }))
    .pipe(gulp.dest(temp));
});

// EMAIL BUILDER
gulp.task('emailBuilder', ['partials'], function() {
  return gulp.src(temp + '*.html')
    .pipe(builder.build())
    .pipe(plugins.htmlmin({
      collapseWhitespace: false,
      minifyCSS: false,
      removeComments: true
    }))
    .pipe(gulp.dest(dist));
});

// DELETE TEMP FILES AND FOLDER
gulp.task('delete', ['emailBuilder'], function() {
  return plugins.del([temp], {
    force: true
  });
});

// http://www.browsersync.io/docs/options
gulp.task('browserSync', function() {
    plugins.browserSync({
        files: [
          dist
        ],
        server: {
          baseDir: dist
        },
        port: 3030,
        open: 'local',
        browser: 'safari'
    });
});

// GULP
gulp.task('auto-reload', function() {
    spawn('gulp', [], {stdio: 'inherit'});
    process.exit();
});

// WATCH
gulp.task('default', ['delete', 'browserSync'], function() {
  gulp.watch([html, inc, sass, css], ['delete']);
  gulp.watch('gulpfile.js', ['auto-reload']);
});
