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
	
gulp.task('clean-app', function () {
	notify('Cleaning application folder');
    return del(['app']);
});
	
gulp.task('clean-app-folder-js', function () {
	notify('Removing files from application JS folder');
    return del(['app/js/**']);
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

gulp.task('serve', ['lint','compress-js','jade'], function() {
	notify('Running a HTTP Server in the port 3000');
	browserSync.init({
        server: {
			baseDir: "app"
		}
	});
	
	gulp.watch("src/js/*.js").on('change', function(){
		gulp.start(['lint','compress-js']);
	});
	gulp.watch("src/*.jade").on('change', browserSync.reload);
});

gulp.task('default', gulpsync.sync(['clean-app','install-components','serve'],'default'));

function notify(msg){
	console.log("\n-- " + msg + " --\n");
}