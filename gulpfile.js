let project_folder="dist";
let source_folder = "#src";
let fs = require('fs');
let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
        svg: project_folder + "/img/icons/"
    },
    src: {
        html: [source_folder + "/**/*.html", "!" + source_folder + "/**/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf",
        svg: source_folder + "/img/icons/*.svg"
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        svg: source_folder + "/img/icons/*.svg"
    },
    clean: "./" + project_folder + "/",
};
let { src, dest } = require("gulp");
let gulp = require('gulp');
let browsersync = require('browser-sync').create();
let fileinclude = require('gulp-file-include');
let scss = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let groupmedia = require('gulp-group-css-media-queries');
let cleancss = require('gulp-clean-css');
let rename = require('gulp-rename');
let sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify-es').default;
let babel = require('gulp-babel');
let imagemin = require('gulp-imagemin');
let webp = require('gulp-webp');
let webphtml = require('gulp-webp-html');
let webpcss = require('gulp-webp-css');
let svgsprite = require('gulp-svg-sprite');
// let htmlValidator = require('gulp-w3c-html-validator');
let ttf2woff = require('gulp-ttf2woff');
let ttf2woff2 = require('gulp-ttf2woff2');
let fonter = require('gulp-fonter');
let del = require('del');


function html() {
    return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    // .pipe(htmlValidator())
    // .pipe(htmlValidator.reporter())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
};
function css () {
    return src(path.src.css)
     .pipe(sourcemaps.init())
     .pipe(
         scss({
             outputStyle: "expanded",
         })
     )
    .pipe (
         autoprefixer({
                overrideBrowserslist: "last 5 versions",
                cascade: true,
         })
     )
    .pipe(groupmedia())
    .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(rename({
        extname: ".min.css"
    }))
    .pipe(cleancss({
        level: {
            2: {
              removeEmpty : true ,
              removeDuplicateFontRules: true,
              removeDuplicateMediaBlocks: true,
              removeDuplicateRules: true,
            }
          }
    }))
    .pipe(sourcemaps.write())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}
function js() {
    return src(path.src.js)
    .pipe(fileinclude())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
        extname: ".min.js"
    }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
};
function images() {
    return src(path.src.img)
    .pipe(webp({
        quality: 70
    }))
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))

    .pipe(
        imagemin({
            progressive: true,
            svgoPlugins:[{removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 3
    }))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
};
function svg() {
    return src(path.src.svg)
    .pipe(svgsprite({
        mode: {
            stack: {
                sprite: "../sprite.svg",
            }
        }
    }))
    .pipe(dest(path.build.svg))

};

function fonts () {
    src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
}

gulp.task('otf2ttf', function() {
    return src([source_folder + '/fonts/*.otf'])
    .pipe(fonter({
        formats: ['ttf']
    }))
    .pipe(dest(source_folder + '/fonts/'));
})

function fontsStyle() {

    let file_content = fs.readFileSync(source_folder + '/scss/_fonts.scss');
    if (file_content == '') {
    fs.writeFile(source_folder + '/scss/_fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
    if (items) {
    let c_fontname;
    for (var i = 0; i < items.length; i++) {
    let fontname = items[i].split('.');
    fontname = fontname[0];
    if (c_fontname != fontname) {
    fs.appendFile(source_folder + '/scss/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
    }
    c_fontname = fontname;
    }
    }
    })
    }
    }
    
    function cb() { }

function watchFiles() {
    gulp.watch([path.watch.html],html);
    gulp.watch([path.watch.css],css);
    gulp.watch([path.watch.js],js);
    gulp.watch([path.watch.img],images);
    gulp.watch([path.watch.svg ],svg);
}
function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false,
    })
};
function clean () {
    return del(path.clean);
}

// let build = gulp.series(clean,gulp.parallel(html,css,js,images,svg));
let build = gulp.series(clean,gulp.parallel(html, css, js, images, svg, fonts),fontsStyle);

let watch = gulp.parallel(build,watchFiles,browserSync);
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.svg = svg;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;