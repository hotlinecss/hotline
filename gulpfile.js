const gulp   = require("gulp");
const sass   = require("gulp-sass");
const size   = require("gulp-size");
const clean  = require("gulp-clean-css");
const header = require("gulp-header")
const rename = require("gulp-rename");
const prefix = require("gulp-autoprefixer");
const pkg    = require("./package.json");

const options = {
	"paths": {
		"srcAll": "./src/*.scss",
		"src": "./src/xvx.scss",
		"dist": "./css/",
		"root": "./"
	},
	"prefix": ["last 2 versions"]
}

gulp.task("build:css", function() {
	return gulp.src(options.paths.srcAll)
		.pipe(sass().on("error", sass.logError))
		.pipe(prefix({browsers: options.prefix }))
		.pipe(header("/* ${pkg.name} - ${pkg.version} */\n", {pkg: pkg}))
		.pipe(gulp.dest(options.paths.dist))
		.pipe(size({title: "Raw: "}))
		.pipe(clean())
		.pipe(rename({suffix: ".min"}))
		.pipe(header("/* ${pkg.name} - ${pkg.version} */\n", {pkg: pkg}))
		.pipe(size({title: "Min: "}))
		.pipe(gulp.dest(options.paths.dist))
});

gulp.task("default", ["build:css"], function() {
	gulp.watch("./src/**/*.scss", ["build:css"])
})