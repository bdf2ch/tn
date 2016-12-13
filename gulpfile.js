var gulp = require("gulp");
var gutil = require('gulp-util');
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var plumber = require("gulp-plumber");
var cleanCSS = require("gulp-clean-css");
var liveReload = require("gulp-livereload");

gulp.task("default", function() {
    return gutil.log("Gulp is running!");
    //var watcher = gulp.watch(["modules/*/*.js", "modules/*/*/*.js"], ["js"]);
    //watcher.on('change', function(event) {
    //    console.log('File ' + event.path + ' was ' + event.type);
    //});
});


gulp.task("homunculus", function () {
    return gulp.src(["clientside/modules/homunculus/*.js", "clientside/modules/homunculus/services/*.js", "clientside/modules/homunculus/directives/*.js", "clientside/modules/homunculus/filters/*.js"])
        .pipe(plumber())
        .pipe(concat("homunculus.js"))
        .pipe(gulp.dest("clientside/dist/js"))
});


gulp.task("homunculus.ui", function () {
    return gulp.src(["clientside/modules/homunculus.ui/*.js", "clientside/modules/homunculus.ui/services/*.js", "clientside/modules/homunculus.ui/directives/*.js", "clientside/modules/homunculus.ui/filters/*.js"])
        .pipe(plumber())
        .pipe(concat("homunculus.ui.js"))
        .pipe(gulp.dest("clientside/dist/js"))
});

gulp.task("classes", ["homunculus", "homunculus.ui"], function () {
    return gulp.src("clientside/modules/*/classes/*.js")
        .pipe(plumber())
        .pipe(concat("classes.js"))
        .pipe(gulp.dest("clientside/dist/js"));
});


gulp.task("app", ["classes"], function () {
    return gulp.src(["clientside/modules/violations/*.js", "clientside/modules/violations/*/*.js", "clientside/modules/application/*.js"])
        .pipe(plumber())
        .pipe(concat("app.js"))
        .pipe(gulp.dest("clientside/dist/js"));
});

gulp.task("js", ["app"], function () {
   return gulp.src([
       //"clientside/modules/homunculus/*.js",
       //"clientside/modules/homunculus/*/*.js",
       //"clientside/modules/homunculus.ui/*.js",
       //"clientside/modules/homunculus.ui/*/*.js",
       //"clientside/modules/application/*.js",
       //"clientside/modules/homunculus.ui/**/*.js",
       //"clientside/modules/violations/*.js",
       //"clientside/modules/violations/*/*.js"])
       "clientside/dist/js/homunculus.js",
       "clientside/dist/js/homunculus.ui.js",
       "clientside/dist/js/classes.js",
       "clientside/dist/js/app.js"
        ])
       .pipe(plumber())
       .pipe(concat("source.min.js"))
       //.pipe(uglify())
       .pipe(gulp.dest("clientside/dist/js"))
});

gulp.task("auth", function () {
    return gulp.src([ "clientside/modules/authorization/*.js", "clientside/modules/authorization/**/*.js"])
        .pipe(plumber())
        .pipe(concat("auth.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("clientside/dist/js"))
});

var watcher = gulp.watch(["clientside/modules/*/*.js", "clientside/modules/*/*/*.js"], ["js"]);
watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type);
});

var auth = gulp.watch(["clientside/modules/authorization/**/*.js"], ["auth"]);
watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type);
});



gulp.task('homunculus-ui-css', function() {
    return gulp.src('clientside/modules/homunculus.ui/resources/*.css')
        .pipe(plumber())
        .pipe(concat("ui.css"))
        .pipe(gulp.dest('clientside/dist/css'));
});
var homunculusUiWatcher = gulp.watch("clientside/modules/homunculus.ui/resources/*.css", ["css"]);


gulp.task('application-css', function() {
    return gulp.src('clientside/resources/styles/*.css')
        .pipe(plumber())
        .pipe(concat("app.css"))
        .pipe(gulp.dest('clientside/dist/css'));
});
var homunculusUiWatcher = gulp.watch("clientside/resources/styles/*.css", ["css"]);

gulp.task('css', ["homunculus-ui-css", "application-css"], function() {
    return gulp.src(['clientside/dist/css/app.css', "clientside/dist/css/ui.css"])
        .pipe(plumber())
        .pipe(concat("styles.min.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest('clientside/dist/css'))
        .pipe(liveReload({ start: true }));
});
