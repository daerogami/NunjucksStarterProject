var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var nunjucksRender = require('gulp-nunjucks-render');
var express = require('express');

gulp.task('nunjucks', function() {
    return gulp.src('app/pages/**/*.+(html|nunjucks|njk)')
    .pipe(nunjucksRender({
        path: ['app/templates']
      }))
    .pipe(gulp.dest('web'))
  });
  
gulp.task('deploy-artifacts', function(){
    var deployFavicon = gulp.src('app/assets/favicon/**/*.+(png|xml|ico|json)')
        .pipe(gulp.dest('web'));
    var deployImages = gulp.src('app/assets/images/**/*')
        .pipe(gulp.dest('web/images'));
    var deployScripts = gulp.src('app/assets/scripts/**/*.+(js)')
        .pipe(gulp.dest('web/scripts'));
        
    return [deployFavicon, deployImages, deployScripts];
  });

gulp.task('sass', function () {
    return gulp.src('app/assets/scss/styles.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('web/css'));
  });

gulp.task('watch', function(){
  gulp.watch('app/assets/scss/**/*.scss', ['sass']);
  gulp.watch('app/**/*.njk', ['nunjucks']);
  gulp.watch(['app/assets/favicon/**/*','app/assets/images/**/*','app/assets/scripts/**/*'], ['deploy-artifacts']);
});

gulp.task('serve', function(){
  const app = express();
  const port = 3030;

  app.use(express.static('web'));
  app.get('/', function(req, res) {
    res.sendFile('index.html', {root : __dirname + '/web'});
  });
  app.listen(port, () => console.log(`Example app listening on port ${port}`));
});

gulp.task('default', ['sass', 'nunjucks', 'deploy-artifacts', 'watch']);