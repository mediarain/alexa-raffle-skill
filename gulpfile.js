'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const s3 = require('gulp-s3-upload')({ useIAM: true });
const config = require('./config');
const zip = require('gulp-zip');
const awsLambda = require('node-aws-lambda');
const merge = require('merge-stream');
const install = require('gulp-install');
const runSequence = require('run-sequence');

gulp.task('watch', () => {
  nodemon({
    script: 'www/server.js',
    watch: ['www/*', 'config/*', 'services/*', 'skill/*'],
    ext: 'json js',
    ignore: ['node_modules/**/*'],
  });
});

gulp.task('run', () => {
  require('./www/server.js');
});

gulp.task('zip', () => {
  gulp
    .src('./dist/**/*')
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
});


gulp.task('bundle', () => {
  gulp
    .src('./package.json')
    .pipe(gulp.dest('./dist'))
    .pipe(install({ production: true }))
  ;
});

gulp.task('compile-lambda', () => {
 const tasks = ['config', 'services', 'skill'].map(directory => gulp
     .src(`${directory}/**/*`)
     .pipe(gulp.dest(`./dist/${directory}`)));
 return merge(tasks);
});


gulp.task('upload', (callback) => {
  const awsConfig = require('./aws-config'); // eslint-disable-line import/no-unresolved,global-require
  awsLambda.deploy('./dist.zip', awsConfig, callback);
});

// Deploying
gulp.task('deploy-lambda', callback => runSequence( ['bundle'], ['compile-lambda'], ['zip'], ['upload'], callback));