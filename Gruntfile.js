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
			 	files: {
			 		'js/scripts.js': ['src/js/scripts.js'],
			 		'js/lib/knockout-3.3.0.js': ['src/js/lib/knockout-3.3.0.js']
			 	}
			 }
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'src/css',
					src: ['*.css', '!*.min.css'],
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
				src: 'src/index.html',
				dest: 'index.html'
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
			}
		},
		watch: {
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['concat', 'uglify', 'inline'],
			},
			css: {
				files: ['src/css/**/*.css'],
				tasks: ['concat', 'cssmin', 'inline'],
			},
			img: {
				files: ['src/images/**/*'],
				tasks: ['imagemin'],
			},
			release: {
				files: ['src/index.html'],
				tasks: ['inline']
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
	grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'imagemin', 'inline', 'watch']);
};