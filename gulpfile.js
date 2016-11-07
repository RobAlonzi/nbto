var gulp = require("gulp"),
	$ = require("gulp-load-plugins")(),
	browserify = require("browserify"),
	babelify = require("babelify"),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer"),
	glob = require('glob');


const config = {
	styles: {
		src: ["./src/style/site.scss", "./src/style/site-mobile.scss"],
		watchSrc: './src/style/**/*.scss',
		devDest: "./dist/stg/styles",
		prodDest: "./dist/prod/styles",
		autoprefix: ["last 2 versions"],
	},

	scripts: {
		src : './src/js/Snb.**.js',
		watchSrc: './src/js/*.js',
		devDest: "./dist/stg/scripts",
		prodDest: "./dist/prod/scripts",
		bundle: "app.js"
	}
}	

gulp.task("dev:styles", devStyles);
gulp.task("dev:scripts", devScripts);
gulp.task("dev", gulp.parallel("dev:styles","dev:scripts"));
gulp.task("dev:watch", gulp.series("dev", devWatch));

gulp.task("prod:styles", prodStyles);
gulp.task("prod:scripts", prodScripts);
gulp.task("prod", gulp.parallel("prod:scripts","prod:styles"));


gulp.task('doc', function (cb) {
    gulp.src(['README_doc.md', './src/js/*.js'], {read: false})
        .pipe($.jsdoc3(cb));
});


gulp.task("default", gulp.series("dev"));

function devWatch() {
	gulp.watch(config.styles.watchSrc, gulp.series("dev:styles"));
	gulp.watch(config.scripts.watchSrc, gulp.series("dev:scripts"));
}


function devStyles(){
	return gulp
		.src(config.styles.src)
		.pipe($.sourcemaps.init())
		.pipe($.sass())
		.pipe($.autoprefixer({
			broswers: config.styles.autoprefix
		}))
		.pipe($.sourcemaps.write("."))
		.pipe(gulp.dest(config.styles.devDest));
}

function prodStyles(){
	return gulp
			.src(config.styles.src)
			.pipe($.sass())
			.pipe($.autoprefixer({
				broswers: config.styles.autoprefix
			}))
			.pipe($.cleanCss())
			.pipe(gulp.dest(config.styles.prodDest));
}



function devScripts() {
 return glob(config.scripts.src, (err, files) => {
 	if(err)
 		done(err);

 	const tasks = files.map((entry) => {
		return createBundler(entry, true).bundle()
		.pipe(source(entry))
		.pipe(buffer()) //optional
		.pipe($.rename({
			dirname: ''
		}))
		.pipe(gulp.dest(config.scripts.devDest));

 	});
 });
};	


function prodScripts() {
 return glob(config.scripts.src, (err, files) => {
 	if(err)
 		done(err);

 	const tasks = files.map((entry) => {
		return createBundler(entry, false).bundle()
		.pipe(source(entry))
		.pipe(buffer()) //required
		.pipe($.uglify())
		.pipe($.rename({
			dirname: ''
		}))
		.pipe(gulp.dest(config.scripts.prodDest));

 	});
 });
};	



function createBundler(file, isDebug) {
	const bundler = browserify(file, {
	debug : isDebug,
	cache: {},
	noParse: ["lodash", "jquery", "jquery-ui"]
	});

	bundler.transform(babelify);

	return bundler;
}