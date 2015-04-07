module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			js: {
				src: ['src/js/app/*.js'],
				dest: 'src/js/scripts.js',
			},
			vendorjs: {
				src: ['src/js/lib/*.js'],
				dest: 'src/js/vendors.js',
			},
			css: {
				src: ['src/css/app/*.css'],
				dest: 'src/css/styles.css',
			},
			vendorcss: {
				src: ['src/css/lib/*.css'],
				dest: 'src/css/vendors.css',
			},
		},
		uglify: {
			 target: {
			 	files: [{
			 		expand: true,
					cwd: 'src/js',
					src: '**/*.js',
					dest: 'js'
				}]
			 }
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'src/css',
					src: ['*.css'],
					dest: 'css',
					ext: '.css'
				}]
			}
		},
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'src/images',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: 'images'
				}]
			}
		},
		inline: {
			dist: {
				src: 'index.html'
			}
		},
		copy: {
			fonts: {
				cwd: 'src/font',
				src: '**/*',      
				dest: 'font',
				expand: true
			},
			images: {
				cwd: 'src/img',
				src: '**/*',      
				dest: 'img',
				expand: true
			},
			index: {
				cwd: 'src',
				src: 'index.html',      
				dest: '',
				expand: true
			}
		},
		watch: {
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['uglify'],
			},
			css: {
				files: ['src/css/**/*.css'],
				tasks: ['cssmin'],
			},
			img: {
				files: ['src/images/**/*'],
				tasks: ['imagemin'],
			},
			release: {
				files: ['src/index.html'],
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
	grunt.registerTask('default', ['uglify', 'cssmin', 'imagemin', 'copy:index', 'inline', 'watch']);
};