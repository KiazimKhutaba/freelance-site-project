const { src, dest, watch } = require('gulp');
const rename        = require('gulp-rename');
const nunjucks      = require('gulp-nunjucks');
const prettifyHtml  = require('gulp-pretty-html');
const del           = require('del');
const sass          = require('gulp-sass');
sass.compiler       = require('node-sass');
const removeEmptyLines = require('gulp-remove-empty-lines');



const template = () => (
    src([   
        './src/templates/**/*.njk',
        '!./src/templates/parts/**/*',
        '!./src/templates/macro/**/*'
    ])
        .pipe(nunjucks.compile())
        .pipe(rename({ extname: '.html' }))
        .pipe(prettifyHtml())
        .pipe(removeEmptyLines())
        .pipe(dest('dist'))
);


const styles = () => (
    src('./src/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./dist/styles'))
);


const scripts = () => (
    src('./src/scripts/**/*.js')
        .pipe(dest('./dist/js'))
);


const clean = () => del(['dist/*'])


const buildOnChange = () =>  (
    watch('src/**/*').on('all',(path,file) => {
        //console.log(`Operation: ${path}; File: ${file}`)
        console.log('Rebuild running...');

        template();
        styles();
        scripts();

        console.log('Rebuild completed.');
    })
);

exports.default = () => (template(), styles(), scripts())


exports.buildOnChange = buildOnChange;
exports.build = template;
exports.sass  = styles;
exports.js    = scripts;
exports.clean = clean;
