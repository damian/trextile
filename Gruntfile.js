module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      src: ['src/*.js'],
      options: {
        specs: 'spec/*spec.js'
      },
      coverage: {
        src: ['src/*.js'],
        options: {
          specs: ['spec/*spec.js'],
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
      all: ['src/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', ['jshint', 'jasmine']);
};
