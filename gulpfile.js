var gulp = require('gulp');
var del = require('del');
var install = require('gulp-install');
var jade = require('gulp-jade');
var browserSync = require('browser-sync').create();
var gulpsync = require('gulp-sync')(gulp);

gulp.task('clean-app', function () {
    return del(['app']);
});

gulp.task('install-components', function(){
	return gulp.src(['./bower.json'])
  				.pipe(install());
});

gulp.task('jade', function() {
    return gulp.src('./src/*.jade')
    			.pipe(jade())
    			.pipe(gulp.dest('./app/'));
});

gulp.task('serve', function() {

	browserSync.init({
        server: {
			baseDir: "src"
		}
	});

    gulp.watch("src/**").on('change', browserSync.reload);
});


gulp.task('default', gulpsync.sync(['clean-app','install-components','jade','serve'],'default'));
