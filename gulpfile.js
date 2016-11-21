var gulp   = require("gulp");
var sass   = require("gulp-sass");
var size   = require("gulp-size");
var clean  = require("gulp-clean-css");
var header = require("gulp-header")
var rename = require("gulp-rename");
var prefix = require("gulp-autoprefixer");
var pkg    = require("./package.json");

gulp.task("css", function() {
	return gulp.src("./src/*.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(prefix({browsers: ["last 2 versions"]}))
		.pipe(header("/* ${pkg.name} - ${pkg.version} */\n", {pkg: pkg}))
		.pipe(gulp.dest("./dist/"))
		.pipe(size({title: "Raw: "}))
		.pipe(clean())
		.pipe(rename({suffix: ".min"}))
		.pipe(header("/* ${pkg.name} - ${pkg.version} */\n", {pkg: pkg}))
		.pipe(size({title: "Min: "}))
		.pipe(gulp.dest("./dist/"))
});

gulp.task("default", ["css"], function() {
	gulp.watch("./src/**/*.scss", ["css"])
})