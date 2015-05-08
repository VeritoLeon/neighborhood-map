module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            js: {
                src: ['js/app/*.js'],
                dest: 'js/scripts.js',
            },
            vendorjs: {
                src: ['js/lib/*.js'],
                dest: 'js/vendors.js',
            },
            css: {
                src: ['css/app/*.css'],
                dest: 'css/styles.css',
            },
            vendorcss: {
                src: ['css/lib/*.css'],
                dest: 'css/vendors.css',
            },
        },
        uglify: {
             target: {
                files: [{
                    expand: true,
                    cwd: 'js',
                    src: '**/*.js',
                    dest: 'dist/js'
                }]
             }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.css'],
                    dest: 'dist/css',
                    ext: '.css'
                }]
            }
        },
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 5
                },
                files: [{
                    expand: true,
                    cwd: 'images',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'dist/images'
                }]
            }
        },
        inline: {
            dist: {
                src: 'dist/index.html'
            }
        },
        copy: {
            fonts: {
                cwd: 'font',
                src: '**/*',      
                dest: 'dist/font',
                expand: true
            },
            images: {
                cwd: 'img',
                src: '**/*',      
                dest: 'dist/img',
                expand: true
            },
            index: {
                cwd: '',
                src: 'index.html',      
                dest: 'dist',
                expand: true
            }
        },
        pleeease: {
            custom: {
                options: {
                    autoprefixer: {'browsers': ['last 4 versions']},
                    filters: {'oldIE': true},
                    rem: ['12px'],
                    minifier: true,
                },
                files: {
                    'dist/css/': 'css/*.css'
                }
            }
        },
        watch: {
            js: {
                files: ['js/**/*.js'],
                tasks: ['uglify'],
            },
            css: {
                files: ['css/**/*.css'],
                tasks: ['cssmin'],
            },
            img: {
                files: ['images/**/*'],
                tasks: ['imagemin'],
            },
            release: {
                files: ['index.html'],
                tasks: ['copy:index', 'inline']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-pleeease');
    grunt.registerTask('default', ['uglify', 'pleeease', 'imagemin', 'copy:index', 'inline', 'watch']);
};