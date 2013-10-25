var srcFiles = ['src/*.js'],
    specFiles = ['spec/*spec.js'];

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jasmine: {
      src: srcFiles,
      options: {
        specs: specFiles[0]
      },
      coverage: {
        src: srcFiles,
        options: {
          specs: specFiles,
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'bin/coverage/coverage.json',
            report: [
              { type: 'text-summary' }
            ],
            thresholds: {
              lines: 99,
              statements: 99,
              branches: 99,
              functions: 99
            }
          }
        }
      }
    },
    jshint: {
      all: srcFiles
    },
    watch: {
      files: srcFiles.concat(specFiles),
      tasks: ['test']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint', 'jasmine']);

  grunt.registerTask('default', ['jshint', 'jasmine', 'uglify']);
};
