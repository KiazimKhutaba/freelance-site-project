const { src, dest, watch, parallel } = require('gulp');
const rename = require('gulp-rename');
const nunjucks = require('gulp-nunjucks');
const prettifyHtml = require('gulp-pretty-html');
const del = require('del');
const liveServer = require('live-server');
const sass = require('gulp-sass')(require('sass'));
const removeEmptyLines = require('gulp-remove-empty-lines');
const autoprefixer = require('gulp-autoprefixer');
const changed = require('gulp-changed');


const config = {

    paths: {
        templates: [
            './src/templates/**/*.njk',
            '!./src/templates/base/**/*',
            '!./src/templates/parts/**/*',
            '!./src/templates/macro/**/*'
        ],
        styles: [
            './src/styles/**/*.scss',
            './src/styles/**/*.css'
        ],
        scripts: [
            './src/scripts/**/*.js'
        ],
        images: [
            './src/images/**/*.{gif,jpg,png,svg}'
        ],
        icons: [
            './src/icons/*'
        ],
        watch: 'src/**/*'
    }
}

// tasks
const compileTemplates = () => {

    const errorHandler = function (err) {
        console.error(err.toString());
        this.emit('end');
    }

    src(config.paths.templates)
        //.pipe(changed('dist', {extension: '.html'}))
        .pipe(nunjucks.compile())
        .on('error', errorHandler)
        .pipe(rename({ extname: '.html' }))
        .pipe(prettifyHtml())
        .pipe(removeEmptyLines())
        .pipe(dest('dist'))
};


const styles = () => (
    src(config.paths.styles)
        //.pipe(changed('dist/styles', {extension: '.css'}))
        .pipe(sass().on('error', sass.logError))
        //.pipe(autoprefixer(['last 2 versions']))
        .pipe(dest('./dist/styles'))
);


const scripts = () => (
    src(config.paths.scripts)
        //.pipe(changed('dist/js'))
        .pipe(dest('./dist/js'))
);


const copyImages = () => (
    src(config.paths.images)
        .pipe(changed('dist/images'))
        .pipe(dest('dist/images'))
);

const copyIcons = () => (
    src(config.paths.icons)
        .pipe(changed('dist'))
        .pipe(dest('dist'))
);


const clean = () => del(['dist/*'])


const allTasks = () => (
    copyIcons(),
    copyImages(),
    compileTemplates(),
    styles(),
    scripts()
)

const allTasksParallel = parallel(copyIcons, copyImages, compileTemplates, styles, scripts);


const devServer = () => {

    liveServer.start({
        host: '127.0.0.1',
        port: 8080,
        wait: 300,
        root: 'dist'
    });

    allTasksParallel();
    
    watch(config.paths.watch).on('all', (path, file) => {
        //console.time('Build');

        allTasksParallel();

        //console.timeEnd('Build');
    })
}


// exports.default = allTasks;
exports.default = allTasksParallel;


exports.copyImages = copyImages;
exports.devServer = devServer;
exports.build = compileTemplates;
exports.sass  = styles;
exports.js = scripts;
exports.clean = clean;
