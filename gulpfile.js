"use strict";
var gulp = require('gulp');

//guip flow control
var gulpif = require('gulp-if');
var sync = require('gulp-sync')(gulp);
//build tools
var del = require('del');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
//edit minification
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssMin = require('gulp-clean-css');
var htmlMin = require('gulp-htmlmin');
//runtime tools
var browserSync = require('browser-sync').create();
//where we place out source code
var srcPath = "client/src"
//where any processed cor or vendor files gets placed for use in development
var buildPath = "client/build"
//location to place vendor files for use in development
var vendorBuildPath = buildPath + "/vendor";
//where the final web application is placed
var distPath = "public/client";
var bowerPath = "bower_components"


var cfg = {
  //our client application source code src globs and build paths
  root_html :     { src: srcPath + "/index.html", bld: buildPath },
  css:            { src: srcPath + "/stylesheets/**/*.css", bld: buildPath + "/stylesheets" },
  js:             { src: srcPath + "/javascript/**/*.js"},
  html:           { src: [srcPath + "/**/*.html","!"+srcPath + "/*.html"] },
  bootstrap_sass: { src: bowerPath + "/bootstrap-sass/assets/stylesheets" },

  //vendor fonts src globs
  bootstrap_fonts: { src: bowerPath + "/bootstrap-sass/assets/fonts/**/*"},
  //vendor js src globs
  jquery:            { src: bowerPath + "/jquery2/jquery.js" },
  bootstrap_js:      { src: bowerPath + "/bootstrap-sass/assets/javascripts/bootstrap.js"},
  angular:           { src: bowerPath + "/angular/angular.js" },
  angular_ui_router: { src: bowerPath + "/angular-ui-router/release/angular-ui-router.js"},
  angular_resource:  { src: bowerPath + "/angular-resource/angular-resource.js"},

  //vendor build locations
  vendor_js :    { bld: vendorBuildPath + "/javascripts" },
  vendor_css :   { bld: vendorBuildPath + "/stylesheets"},
  vendor_fonts : { bld:  vendorBuildPath + "/stylesheets/fonts"},

  apiUrl: {dev: "https://localhost:3000",
           prd: "https://glacial-earth-69618.herokuapp.com"},

};

var devResourcePath = [
  cfg.vendor_js.bld,
  cfg.vendor_css.bld,
  buildPath+"/javascripts",
  buildPath+"/stylesheets",
  srcPath,
  srcPath+"/javascripts",
  srcPath+"/stylesheets",
];

//remove all files below the buid area
gulp.task("clean:build", function(){
  return del(buildPath);
});

//remove all files below the dist area
gulp.task("clean:dist", function(){
  return del(distPath);
});

//remove all files below both the build and dist area
gulp.task("clean",["clean:build","clean:dist"]);

gulp.task("vendor_css", function(){
  //return gulp.src([]).pipe(gulp_dest(cfg.vendor_css.bld));
});

gulp.task("vendor_js", function(){
  return gulp.src([
    cfg.jquery.src,
    cfg.bootstrap_js.src,
    cfg.angular.src,
    cfg.angular_ui_router.src,
    cfg.angular_resource.src,
  ]).pipe(gulp.dest(cfg.vendor_js.bld));
});

gulp.task('vendor_fonts', function(){
  //access the following font files
  return gulp.src([
    cfg.bootstrap_fonts.src,
  ]).pipe(gulp.dest(cfg.vendor_fonts.bld));
});

gulp.task('css',function(){
  return gulp.src(cfg.css.src).pipe(debug())
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: [cfg.bootstrap_sass.src]}))
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest(cfg.css.bld)).pipe(debug());
});

gulp.task("build", sync.sync(["clean:build",["vendor_css","vendor_js","vendor_fonts","css"]]));

function browserSyncInit(baseDir, watchFiles){
  browserSync.instance = browserSync.init(watchFiles, {
    server: {baseDir: baseDir},
    port: 8080,
    ui:  {port: 8090}
});
};

gulp.task("browserSync",["build"], function(){
  browserSyncInit(devResourcePath,[
    cfg.root_html.src,
    cfg.css.bld + "/**/*.css",
    cfg.js.src,
    cfg.html.src,
  ]);
});

gulp.task("run",["build", "browserSync"], function (){
  gulp.watch(cfg.css.src,["css"]);
});

//gulp.task("dist:html", function(){
//  return gulp.src(cfg.html.src).pipe(debug())
//    .pipe
//})
gulp.task("dist:assets",["build"], function(){
  return gulp.src(cfg.root_html.src).pipe(debug())
    .pipe(useref({ searchPath: devResourcePath}))
    .pipe(gulpif(["**/*constant.js"], replace(cfg.apiUrl.dev,cfg.apiUrl.prd)))
    .pipe(gulpif(["**/*.js"],uglify()))
    .pipe(gulpif(["**/*.css"],cssMin()))
    .pipe(gulp.dest(distPath)).pipe(debug());
});

gulp.task("dist:fonts", function(){
  return gulp.src(cfg.vendor_fonts.bld + "/**/*", {base: cfg.vendor_css.bld})
    .pipe(gulp.dest(distPath));
});

// gulp.task("dist:html", function(){
//   return gulp.src(cfg.html.src).pipe(debug())
//     .pipe(htmlMin({collapseWhitespace: true}))
//     .pipe(gulp.dest(distPath)).pipe(debug());
// });

gulp.task("dist:html", function(){
  return gulp.src(cfg.html.src , {base: srcPath+"/javascripts"}).pipe(debug())
    .pipe(htmlMin({collapseWhitespace: true}))
    .pipe(gulp.dest(distPath)).pipe(debug());
});

gulp.task("dist", sync.sync(["clean:dist","build","dist:assets","dist:fonts","dist:html"]));
gulp.task("dist:run",["dist"], function(){
  browserSyncInit(distPath);
});
