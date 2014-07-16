var fs = require('fs');
var path = require('path');

var $ = require('gulp-load-plugins')();
var archiver = require('archiver');
var gulp = require('gulp');
var rimraf = require('rimraf');

var pkg = require('./package.json');
var settings;

// -----------------------------------------------------------------------------
// | Project Settings                                                          |
// -----------------------------------------------------------------------------

settings = {

    // Configurable file names
    archive: 'h5bp.zip',

    // Metadata
    banner: '/*! HTML5 Boilerplate v' + pkg.version +
            ' | ' + pkg.license.type + ' License' +
            ' | ' + pkg.homepage + ' */\n\n',

    // Configurable paths
    dir: {
        src: 'src',
        dist: 'dist'
    }

};

// -----------------------------------------------------------------------------
// | Tasks                                                                     |
// -----------------------------------------------------------------------------

gulp.task('build', [
    'copy:files',
    'copy:main.css',
    'copy:normalize',
    'copy:jquery',
    'copy:index.html'
]);

gulp.task('clean', function (cb) {
    rimraf('dist', cb);
});

gulp.task('copy:files', function () {
    return gulp.src([ 'src/**/*',
                      '!src/css/main.css',
                      '!src/index.html' ], {dot: true })
               .pipe(gulp.dest('dist'));
});

gulp.task('copy:main.css', function () {
    return gulp.src(['src/css/main.css' ])
               .pipe($.header(settings.banner))
               .pipe(gulp.dest('dist/css'));
});

gulp.task('copy:normalize', function () {
    return gulp.src(['node_modules/normalize.css/normalize.css'])
               .pipe(gulp.dest('dist/css'));
});

gulp.task('copy:jquery', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
               .pipe($.rename('jquery-' + pkg.devDependencies.jquery + '.min.js'))
               .pipe(gulp.dest('dist/js/vendor'));
});

gulp.task('copy:index.html', function () {
    return gulp.src(['src/index.html'])
               .pipe($.replace(/{{JQUERY_VERSION}}/g, pkg.devDependencies.jquery))
               .pipe(gulp.dest('dist'));
});


// -----------------------------------------------------------------------------

gulp.task('archive', function (cb) {

    var archive = archiver('zip');
    var output = fs.createWriteStream(settings.archive);

    output.on('close', cb);
    archive.on('error', function (err){
        throw err;
    });

    archive.pipe(output);
    archive.bulk([{
        expand: true,
        dot: true,
        cwd: 'dist/',
        src: ['**']
    }]);

    archive.finalize();
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
