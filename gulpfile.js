var gulp = require('gulp');
var del = require('del');
var install = require('gulp-install');
var jade = require('gulp-jade');
var browserSync = require('browser-sync').create();
var gulpsync = require('gulp-sync')(gulp);
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var rename = require('gulp-rename');
var less = require('gulp-less');
var path = require('path');
var cleanCSS = require('gulp-clean-css');
var clear = require('clear');
	
gulp.task('clean-app', function () {
	clear();
	notify('Cleaning application folder');
    return del(['app']);
});
	
gulp.task('clean-app-folder', function (folder) {
	eval('clean_folder.' + folder);
	notify('Removing files from application JS folder');
    return del(['app/js/**']);
});
	
gulp.task('clean-app-folder-js', function () {
	notify('Removing files from application JS folder');
    return del(['app/js/**']);
});
	
gulp.task('clean-app-folder-css', function () {
	notify('Removing files from application CSS folder');
    return del(['app/css/**']);
});

gulp.task('install-components', function(){
	notify('Installing components with Bower');
	return gulp.src(['./bower.json'])
  				.pipe(install());
});

gulp.task('compress-js', ['clean-app-folder-js'], function () {
    return gulp.src('src/js/*.js')
		    	.pipe(gulp.dest('app/js'))
		    	.pipe(uglify())
				.pipe(rename({ suffix: '.min' }))
		    	.pipe(gulp.dest('app/js'))
		        .pipe(browserSync.stream());
});

gulp.task('lint', function() {
	notify('Checking JS for some errors');
	return gulp.src('./src/js/*.js')
	    .pipe(jshint())
	    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jade', function() {
	notify('Rendering JADE templates to HTML');
    return gulp.src('./src/*.jade')
    			.pipe(jade())
    			.pipe(gulp.dest('./app/'))
        		.pipe(browserSync.stream());
});

gulp.task('less', ['clean-app-folder-css'], function () {
  return gulp.src('src/less/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream());
});

gulp.task('serve', ['less','lint','compress-js','jade'], function() {
	notify('Running a HTTP Server in the port 3000');
	
	browserSync.init({
        server: {
			baseDir: "app"
		}
	});
	
	gulp.watch("src/js/*.js").on('change', function(){
		gulp.start(['lint','compress-js']);
	});

	gulp.watch("src/less/*.less").on('change', function(){	
		gulp.start('less');
	});

	gulp.watch("src/*.jade").on('change', function(){
		gulp.start('jade');
	});

	gulp.watch("app/**").on('change', function(){
		browserSync.reload();
	});
});

gulp.task('prod', gulpsync.sync(['clean-app','install-components','serve'],'building production server'));
gulp.task('dev', gulpsync.sync(['serve'],'building development server'));
gulp.task('default',['dev']);

function notify(msg){
	console.log("\n-- " + msg + " --\n");
}