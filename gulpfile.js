'use stritc';

const gulp = require('gulp'),
    //  gulp-file-include插件
    fileinclude = require('gulp-file-include'),
    //  del插件
    del = require('del'),
    //  rename插件
    rename = require('gulp-rename'),
    //  connect插件
    connect = require('gulp-connect'),
    //  less插件
    less = require('gulp-less'),
    //  css 压缩插件
    cssmin = require('gulp-minify-css'),
    //  sourcemap插件
    sourcemaps = require('gulp-sourcemaps'),
    //	图片压缩插件
    imagemin = require('gulp-imagemin'),
    //	深度压缩png图片
    imageminPngquant = require('imagemin-pngquant'),
    //	使用"gulp-cache"只压缩修改的图片
    cache = require('gulp-cache'),
    //  path
    path = require('path'),
    fs = require('fs');

const css = {
        src: 'src/css/**/*',
        dest: 'dist/static/css'
    },
    script = {
        src: 'src/js/**/*',
        dest: 'dist/static/js'
    },
    img = {
        src: 'src/img/**/*',
        dest: 'dist/static/img'
    };

//less编译任务
gulp.task('lessTask', () => {
    gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(cssmin({
            compatibility: 'ie7'
        }))
        .pipe(cssmin()) //兼容IE7及以下需设置compatibility属性 .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(gulp.dest('dist/static/css'));
});
//fileinclude
gulp.task('fileinclude', () => {
    gulp.src('src/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {
                basePath: `http://localhost:8080`,
                langue: "zh_CN",
                userId: "",
                userName: ""
            }
        }))
        .pipe(gulp.dest('dist'))
});
//watch事件
gulp.task('watchTask', () => {
    gulp.watch('src/less/*.less', ['lessTask']); //当所有less文件发生改变时，调用lessTask任务
    gulp.watch('src/**/*.html', ['fileinclude']);
    gulp.watch('src/**/*.*', ['copy-script', 'copy-img', 'copy-css']);
});
//web服务器
gulp.task('server', () => {
    connect.server({
        root: 'dist',
        livereload: true,
    });
});
//复制文件
gulp.task('copy-script', () => {
    return gulp.src(script.src)
        .pipe(gulp.dest(script.dest))
})
gulp.task('copy-img', () => {
    return gulp.src(img.src)
        .pipe(gulp.dest(img.dest))
})
gulp.task('copy-css', () => {
        return gulp.src(css.src)
            .pipe(gulp.dest(css.dest))
    })
    //定义默认任务
gulp.task('default', [
    'lessTask',
    'copy-script',
    'copy-img',
    'copy-css',
    'fileinclude',
    'watchTask',
    'server'
]);
//编译用于发布 todo
gulp.task('build', ['lessTask',
    'copy-script',
    'copy-img',
    'copy-css',
    'fileinclude'
]);
