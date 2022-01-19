var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var sourcemaps = require('gulp-sourcemaps');
var nunjucksRender = require('gulp-nunjucks-render');
var express = require('express');

gulp.task('nunjucks', () => 
    gulp.src('app/pages/**/*.+(html|nunjucks|njk)')
      .pipe(nunjucksRender({
          path: ['app/templates']
        }))
      .pipe(gulp.dest('web'))
  );
  
gulp.task('deploy-favicon', () => gulp.src('app/assets/favicon/**/*.+(png|xml|ico|json)').pipe(gulp.dest('web')));
gulp.task('deploy-images', () => gulp.src('app/assets/images/**/*').pipe(gulp.dest('web/images')));
gulp.task('deploy-scripts', () => gulp.src('app/assets/scripts/**/*.+(js)').pipe(gulp.dest('web/scripts')));
gulp.task('deploy-artifacts', gulp.series('deploy-favicon', 'deploy-images', 'deploy-scripts'));

gulp.task('sass', () =>
    gulp.src('app/assets/scss/styles.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('web/css'))
  );

gulp.task('watch', (done) => {
  gulp.watch('app/assets/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('app/**/*.njk', gulp.series('nunjucks'));
  gulp.watch(['app/assets/favicon/**/*','app/assets/images/**/*','app/assets/scripts/**/*'], gulp.series('deploy-artifacts'));

  return done();
});

gulp.task('serve', (done) => {
  const app = express();
  const port = 3030;

  app.use(express.static('web'));
  app.get('/', function(req, res) {
    res.sendFile('index.html', {root : __dirname + '/web'});
  });
  app.listen(port, () => console.log(`Example app listening on port ${port}`));

  return done();
});

gulp.task('default', gulp.series('sass', 'nunjucks', 'deploy-artifacts', 'watch'));