const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// Static server
//задаем работу сервера в автоматическом режиме
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "src"
        }
    });
});

gulp.task('styles', function() {
    return gulp.src("src/sass/*.+(scss|sass)")
        //указали, что используем или sass или scss препроцессоры
        //задаем параметр сжатости файла
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        // указываем, чтобы файл формировался с суфиксом style.min.css:
        .pipe(rename({
            prefix: "",
            suffix: ".min",
        }))
        // устанавливаем префиксы для последних двух версий браузера - нет в последней версии документации!!!
        .pipe(autoprefixer({
            // browsers: ['last 2 versions'],
			cascade: false
		}))
        //задаем очищение файла после автопрефикса
        .pipe(cleanCSS({compatibility: 'ie8'}))
        //сохраение файла в указанную дирикторию
        .pipe(gulp.dest("src/css"))
        //задаем обновление браузера при компиляции
        .pipe(browserSync.stream());
});

// создадим задачу, которая будет следить за изменениями
gulp.task('watch', function(){
    // указываем за какими файлами следить, и запускаем предыдущую задачу компиляции:
    gulp.watch("src/sass/*.+(scss|sass)", gulp.parallel("styles"));
    // попросим следить за изменениями HTML файлов, при изменении запускаем reload:
    gulp.watch("src/*.html").on ("change", browserSync.reload);
});

// объединяем все задачи, запуск по умолчанию:
gulp.task('default', gulp.parallel('watch','server','styles'));