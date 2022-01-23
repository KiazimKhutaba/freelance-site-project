const { src, dest, watch } = require('gulp');
const rename = require('gulp-rename');
const nunjucks = require('gulp-nunjucks');
const prettifyHtml = require('gulp-pretty-html');
const del = require('del');
const liveServer = require('live-server');
const sass = require('gulp-sass')(require('sass'));
const removeEmptyLines = require('gulp-remove-empty-lines');


// config
const TEMPLATE_PATHS = [
    './src/templates/**/*.njk',
    '!./src/templates/parts/**/*',
    '!./src/templates/macro/**/*'
];

const STYLE_PATHS = ['./src/styles/**/*.scss'];


// tasks
const template = () => {

    const errorHandler = function (err) {
        console.error(err.toString());
        this.emit('end');
    }

    src(TEMPLATE_PATHS)
        .pipe(nunjucks.compile())
        .on('error', errorHandler)
        .pipe(rename({ extname: '.html' }))
        .pipe(prettifyHtml())
        .pipe(removeEmptyLines())
        .pipe(dest('dist'))
};


const styles = () => (
    src(STYLE_PATHS)
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./dist/styles'))
);


const scripts = () => (
    src('./src/scripts/**/*.js')
        .pipe(dest('./dist/js'))
);


const clean = () => del(['dist/*'])


const allTasks = () => (template(), styles(), scripts())


const devServer = () => {

    liveServer.start({
        host: '0.0.0.0',
        port: 5555,
        wait: 500,
        root: 'dist'
    });

    allTasks();
    
    watch('src/**/*').on('all', (path, file) => {
        console.log('Rebuild running...');

        template();
        styles();
        scripts();

        console.log('Rebuild completed.');
    })
}

exports.default = allTasks;


exports.devServer = devServer;
exports.build = template;
exports.sass  = styles;
exports.js = scripts;
exports.clean = clean;
