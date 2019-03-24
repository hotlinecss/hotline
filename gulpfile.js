const { series, src, dest, watch } = require('gulp');
const postcss 		= require("gulp-postcss");
const sass    		= require("gulp-sass");
const mq      		= require("css-mqpacker");
const size    		= require("gulp-size");
const clean   		= require("gulp-clean-css");
const header  		= require("gulp-header")
const rename  		= require("gulp-rename");
const prefix  		= require("gulp-autoprefixer");
const sourcemaps  = require("gulp-sourcemaps");
const pkg         = require("./package.json");

const configuration = {
	rootFolder: './',
	folderDest: './css/',
	sassSrc: './src/*.scss',
	fileDest: './css/hotline.css',
	prefix: ["last 4 years", "not ie <= 9"]
}

const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */', '\n',
	''].join('\n');

function _initSourcemaps (cb) {
	return sourcemaps.init();
}

function _writeSourcemaps (cb) {
	return sourcemaps.write(configuration.rootFolder);
}

function compileWithSass (cb) {
	return src(configuration.sassSrc)
		.pipe(_initSourcemaps())
		.pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(size({ title: 'Expanded' }))
		.pipe(_writeSourcemaps())
		.pipe(dest(configuration.folderDest));
}

function addHeader (cb) {
	return src(configuration.fileDest)
		.pipe(header(banner, { pkg: pkg }))
		.pipe(dest(configuration.folderDest));
}

function prefixCSS (cb) {
	return src(configuration.fileDest)
		.pipe(prefix({ browsers: configuration.prefix }))
		.pipe(dest(configuration.folderDest));
}

function reduceMediaQueries (cb) {
	return src(configuration.fileDest)
		.pipe(postcss([mq()]))
		.pipe(dest(configuration.folderDest));
}

function minifyAndRenameCSS (cb) {
	return src(configuration.fileDest)
		.pipe(_initSourcemaps())
		.pipe(clean())
		.pipe(rename({ suffix: '.min' }))
		.pipe(size({ title: 'Minify' }))
		.pipe(size({ title: 'Minify (gzip)', gzip: true }))
		.pipe(_writeSourcemaps())
		.pipe(dest(configuration.folderDest));
}

const tasks = series(
	compileWithSass,
	addHeader,
	prefixCSS, 
	reduceMediaQueries,
	minifyAndRenameCSS
)

function watching () {
	watch(configuration.sassSrc, tasks);
}

exports.default = series(tasks, watching);

