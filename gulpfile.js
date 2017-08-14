const gulp    = require("gulp");
const postcss = require("gulp-postcss");
const sass    = require("gulp-sass");
const mq      = require("css-mqpacker");
const size    = require("gulp-size");
const clean   = require("gulp-clean-css");
const header  = require("gulp-header")
const rename  = require("gulp-rename");
const prefix  = require("gulp-autoprefixer");
const pkg     = require("./package.json");

const options = {
	"paths": {
		"srcAll": "./src/*.scss",
		"src": "./src/hotline.scss",
		"dist": "./css/",
		"root": "./"
	},
	"prefix": ["last 3 versions"],
	"processors": [mq()]
}

gulp.task("build:css", function() {
	return gulp.src(options.paths.srcAll)
		.pipe(sass({outputStyle: "expanded"}).on("error", sass.logError))
		.pipe(prefix({browsers: options.prefix }))
		.pipe(postcss(options.processors))
		.pipe(header("/* ${pkg.name} - ${pkg.version} - ${pkg.license} */\t", {pkg: pkg}))
		.pipe(gulp.dest(options.paths.dist))
		.pipe(size({title: "Raw: "}))
		.pipe(clean())
		.pipe(rename({suffix: ".min"}))
		.pipe(header("/* ${pkg.name} - ${pkg.version} - ${pkg.license} */\t", {pkg: pkg}))
		.pipe(size({title: "Min: "}))
		.pipe(size({title: "Gzip: ", gzip: true}))
		.pipe(gulp.dest(options.paths.dist))
});

gulp.task("default", ["build:css"], function() {
	gulp.watch(options.paths.srcAll, ["build:css"])
})