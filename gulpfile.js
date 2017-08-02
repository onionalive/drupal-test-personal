var gulp 				= require('gulp');
var $           = require('gulp-load-plugins')();
var browserify  = require('browserify');

var envProp = false;

var dist = 'web/themes/custom/test/';

gulp.task('cacheclear', function () {
  $.cache.clearAll();
});

gulp.task('styles', function () {
	var out = gulp.src('theme-src/scss/main.scss')
		.pipe($.cssGlobbing({
			extensions: ['.scss'],
		}))
		.pipe($.sourcemaps.init())
		.on('error', $.sass.logError)
		.on('error', function (e) {
			$.notify().write(e);
		})

		if (!envProd) {
			out.pipe($.sourcemaps.write())
				.pipe(gulp.dest(dist + 'css'));
		} else {
			out.pipe($.csso());
		}

		//out.pipe($.csso());
		return out.pipe($.rev())
		.pipe(gulp.dest(dist + 'css'))
		.pipe($.rev.manifest(dist + 'css/manifest.json', {
      merge: true,
      base: '',
    }))
		.pipe(gulp.dest(''));
})

/* Lint SASS files */
gulp.task('sass-lint', function () {
  return gulp.src(['!theme-src/css/mixins/**/*', 'theme-src/css/**/*.s+(a|c)ss'])
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError());
});
