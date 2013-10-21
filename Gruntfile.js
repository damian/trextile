module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      src: ['src/*.js'],
      options: {
        specs: 'spec/*spec.js',
        keepRunner: true
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
