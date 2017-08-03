/* jshint node: true */
/* jshint -W098 */
/* jshint -W079 */
var gulp 				= require('gulp');
var $           = require('gulp-load-plugins')();

var rimraf 			= require('rimraf');
var browserify  = require('browserify');

var runSequence	= require('run-sequence');
var vsource		 	= require('vinyl-source-stream');
var vbuffer		 	= require('vinyl-buffer');
var pngquant		= require('imagemin-pngquant');
var babelify    = require('babelify');

var envProd = false;

var dist = 'web/themes/custom/test/';

/* Clean */
gulp.task('clean', function () {
	rimraf.sync('web/themes/custom/test/css');
	rimraf.sync('web/themes/custom/test/js');
});

/* Clear Cache */
gulp.task('cacheclear', function () {
  $.cache.clearAll();
});

/* Copy */
gulp.task('copy', ['theme-info'], function () {
	return gulp.src([
		'theme-src/**/*.php',
		'theme-src/**/*.ico',
		'theme-src/**/*.twig',
		'theme-src/**/*.json',
		'theme-src/fonts/**/*.{woff,woff2,ttf,otf,eot,svg}',
	], {
		base: 'theme-src',
	})
	.pipe(gulp.dest(dist));
});

/* Add theme info CSS */
gulp.task('theme-info', function () {
	return gulp.src('./theme-src/theme-info.txt')
		.pipe($.rename('style.css'))
		.pipe(gulp.dest(dist));
});

/* Stylesheets */
gulp.task('styles', ['print-styles', 'sass-lint'], function () {
	var out = gulp.src('theme-src/css/main.scss')
		.pipe($.cssGlobbing({
			extensions: ['.scss'],
		}))
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.autoprefixer({
			browsers: ['last 3 versions', 'ie >= 8'],
			cascade: false,
		}));

		if (!envProd) {
			out.pipe($.sourcemaps.write())
				.pipe(gulp.dest(dist + 'css'));
		} else {
			out.pipe($.csso());
		}

		return out.pipe($.rev())
			.pipe(gulp.dest(dist + 'css'))
			.pipe($.rev.manifest(dist + 'css/manifest.json', {
	      merge: true,
	      base: '',
	    }))
		.pipe(gulp.dest(''));
})

gulp.task('print-styles', function () {
	return gulp.src('theme-src/css/print.scss')
		.pipe($.sass({
			style: 'expanded',
		}))
		.on('error', $.sass.logError)
		.on('error', function (e) {
			$.notify().write(e);
		})
		.pipe($.autoprefixer({
			browsers: ['last 3 versions', 'ie >= 8'],
			cascade: false,
		}))
		.pipe($.csso())
		.pipe($.rev())
		.pipe(gulp.dest(dist + 'css'))
		.pipe($.rev.manifest(dist + 'css/manifest.json', {
			merge: true,
			base: '',
		}))
		.pipe(gulp.dest(''));
});

/* Lint SASS files */
gulp.task('sass-lint', function () {
  return gulp.src(['!theme-src/css/mixins/**/*', 'theme-src/css/**/*.s+(a|c)ss'])
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError());
});

/* Images */
gulp.task('images', function () {
	return gulp.src('theme-src/img/**/*.{jpg,png,gif,svg}')
	.pipe($.cache(
			$.imagemin([
				$.imagemin.jpegtran({ progressive: true }),
				$.imagemin.optipng(),
				$.imagemin.gifsicle(),
				$.imagemin.svgo({ svgoPlugins: [
					{
						removeViewBox: true,
					},
				], }),
			], {
				verbose: true,
			})
		))
		.pipe(gulp.dest(dist + 'img'));
});

/* Compile Javascript */
gulp.task('javascript', ['eslint'], function () {
	var b = browserify({
		transform: [babelify.configure({
			presets: ["es2015"]
		})],
		entries: './theme-src/js/main.js',
		debug: true,
	});

	var out =	b.bundle()
		.pipe(vsource('scripts.min.js'))
		.pipe(vbuffer())
		.on('error', function (e) {
			$.notify().write(e);
		});

	if (!envProd) {
		out.pipe($.sourcemaps.init({
				loadMaps: true,
			})).pipe($.sourcemaps.write('./'))
			.pipe(gulp.dest(dist + 'js'));
	} else {
		out.pipe($.uglify());
	}

	return out.pipe($.buffer())
		// .pipe($.rev())
		.pipe(gulp.dest(dist + 'js'))
		.pipe($.rev.manifest(dist + 'js/manifest.json', {
			merge: true,
			base: '',
		}))
		.pipe(gulp.dest(''));

});

/* eslint */
gulp.task('eslint', function () {
  return gulp.src(['theme-src/js/**/*.js'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

/** Concatenate JS*/
gulp.task('jsconcat', function () {
	return gulp.src([
			'theme-src/js/vendor/*.js',
		])
		.pipe($.concat('vendor.min.js'))
		.pipe($.rev())
		.pipe(gulp.dest(dist + 'js'))
		.pipe($.rev.manifest(dist + 'js/manifest.json', {
			merge: true,
			base: '',
		}))
		.pipe(gulp.dest(''));
});

/** Livereload */
gulp.task('watch', ['clean', 'images', 'copy', 'styles', 'javascript', 'jsconcat'], function () {
	$.livereload.listen();

	/** Watch for PHP changes */
	gulp.watch('theme-src/**/*.{php,twig,json,html}', ['copy']);

	/** Watch for SASS changes */
	gulp.watch('theme-src/css/**/*.scss', ['styles']);

	/** Watch for JS changes */
	gulp.watch('theme-src/js/**/*.js', ['javascript']);

	/** Watch for Image changes */
	gulp.watch('theme-src/img/**/*.{jpg,png,svg,webp}', ['images']);

	gulp.watch(
		dist + '/**/*.{jpg,png,svg,webp,css,js,php,json,twig,html}'
	).on('change', function (file) {
		$.livereload.changed(file.path);
	});
});

/** Build */
gulp.task('build', [
	'production_env',
	'clean',
	'images',
	'copy',
	'styles',
	'javascript',
	'jsconcat',
]);

gulp.task('default', ['build']);
