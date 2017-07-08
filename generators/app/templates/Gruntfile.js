module.exports = (grunt) => {
    grunt.initConfig({
        // js检查
        eslint: {
            options: {
                configFile: '.eslintrc.js',
                quiet: true
            },
            before: ['js/*.js'],
            after: ['dist/js/*.js']
        },

        // css 处理
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 4 versions']
                    }), // add vendor prefixes
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: '*.css',
                    dest: 'dist/temp/css/',
                    ext: '.css',
                    extDot: 'last'
                }]
            }
        },
        // js 压缩
        uglify: {
            options: {
                screwIE8: false // for IE6-8
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'js',
                    src: '*.js',
                    dest: 'dist/temp/js/',
                    ext: '.js',
                    extDot: 'last'
                }]
            }
        },

        // 文件名hash
        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            css: {
                src: 'dist/temp/css/*.css',
                dest: 'dist/css/'
            },
            js: {
                src: 'dist/temp/js/*.js',
                dest: 'dist/js/'
            },
            img: {
                src: 'imgs/*.{jpg,jpeg,gif,png,webp}',
                dest: 'dist/imgs/'
            }
        },
        // 替换原文件引用名称
        filerev_replace: {
            options: {
              assets_root: 'dist/temp/'
            },
            // compiled_assets: {
            //   src: 'dist/**/*.js'
            // },
            views: {
              options: {
                views_root: 'dist/'
              },
              src: 'dist/**/*.{aspx,css,js}'
            }
        },

        // html 压缩
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true,
                minifyCSS: true,
                keepClosingSlash: true
            },
            html: {
                files: [{
                    expand: true,
                    cwd: 'html',
                    src: '*.html',
                    dest: 'dist/html/',
                    ext: '.html',
                    extDot: 'first'
                }]
            },
            aspnet: {
                files: [{
                    expand: true,
                    cwd: 'aspnet',
                    src: '*.aspx',
                    dest: 'dist/aspnet/',
                    ext: '.aspx',
                    extDot: 'first'
                }
            },
            php: {
                files: [{
                    expand: true,
                    cwd: 'php',
                    src: '*.php',
                    dest: 'dist/php/',
                    ext: '.php',
                    extDot: 'first'
                }
            }
        },

        // 清除
        clean: {
            css: ['dist/css/', 'dist/css/'],
            js: ['dist/js/', 'dist/js/'],
            aspnet: ['dist/aspnet/', 'dist/aspnet/'],
            php: ['dist/php/', 'dist/php/'],
            html: ['dist/html/', 'dist/html/'],
            img: ['dist/imgs/', 'dist/imgs/'],
            temp: ['dist/*.temp/']
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('minify-css', ['clean:css', 'postcss', 'filerev:css']);
    grunt.registerTask('minify-js', ['clean:js', 'eslint:before', 'uglify', 'filerev:js']);
    grunt.registerTask('minify-img', ['clean:img', 'filerev:img']);
    grunt.registerTask('minify-html', ['clean:html', 'htmlmin:html']);
    grunt.registerTask('minify-aspnet', ['clean:aspnet', 'htmlmin:aspnet']);
    grunt.registerTask('minify-php', ['clean:php', 'htmlmin:php']);
    grunt.registerTask('default', ['minify-css', 'minify-js', 'minify-html', 'minify-aspnet', 'minify-php', 'minify-img', 'filerev_replace', 'clean:temp']);
};
