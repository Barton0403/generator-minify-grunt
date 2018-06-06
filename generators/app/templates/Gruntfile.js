module.exports = (grunt) => {
    grunt.initConfig({
        // js检查
        eslint: {
            options: {
                configFile: '.eslintrc.js',
                quiet: true
            },
            before: ['static/js/**/*.js'],
            after: ['build/js/**/*.js']
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
                    cwd: 'build/static/css',
                    src: '**/*.css',
                    dest: 'build/static/css',
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
                    cwd: 'build/static/js',
                    src: '**/*.js',
                    dest: 'build/static/js',
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
                files: [{
                    src: 'static/css/*.css',
                    dest: 'build/static/css/'
                }]
            },
            js: {
                files: [{
                    src: 'static/js/page/*.js',
                    dest: 'build/static/js/page/'
                }, {
                    src: 'static/js/plugin/*.js',
                    dest: 'build/static/js/plugin/'
                }]
            },
            img: {
                files: [{
                    src: 'static/images/icon/*.{jpg,jpeg,gif,png,webp}',
                    dest: 'build/static/images/icon/'
                }]
            },
            font: {
                files: [{
                    src: 'static/font/*.{ttf,woff}',
                    dest: 'build/static/font/'
                }]
            }
        },
        // 替换原文件引用名称
        filerev_replace: {
            options: {
              assets_root: 'build/static/'
            },
            // compiled_assets: {
            //   src: 'dist/**/*.js'
            // },
            views: {
              options: {
                views_root: 'build'
              },
              src: 'build/**/*.{html,php,aspx,css,js}'
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
                    dest: 'build/html/',
                    ext: '.html',
                    extDot: 'first'
                }]
            },
            aspnet: {
                files: [{
                    expand: true,
                    cwd: 'aspnet',
                    src: '*.aspx',
                    dest: 'build/aspnet/',
                    ext: '.aspx',
                    extDot: 'first'
                }]
            },
            php: {
                files: [{
                    expand: true,
                    cwd: 'php',
                    src: '*.php',
                    dest: 'build/php/',
                    ext: '.php',
                    extDot: 'first'
                }]
            }
        },

        // 清除
        clean: {
            css: ['build/static/css/'],
            js: ['build/static/js/'],
            html: ['build/html/'],
            php: ['build/php/'],
            aspnet: ['build/aspnet/'],
            img: ['build/static/images/'],
            temp: ['build/temp/'],
            font: ['build/static/font/']
        }

        copy: {
            view: {
                files: [
                    // includes files within path and its sub-directories
                    { expand: true, cwd: 'view/', src: ['**'], dest: 'build/html/' },
                ],
            },
        },
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('minify-css', ['clean:css', 'filerev:css', 'postcss']);
    grunt.registerTask('minify-js', ['clean:js', 'eslint:before', 'filerev:js', 'uglify']);
    grunt.registerTask('minify-img', ['clean:img', 'filerev:img']);
    grunt.registerTask('minify-html', ['clean:html', 'htmlmin:html']);
    grunt.registerTask('minify-aspnet', ['clean:aspnet', 'htmlmin:aspnet']);
    grunt.registerTask('minify-php', ['clean:php', 'htmlmin:php']);
    grunt.registerTask('copy-view', ['clean:html', 'copy:view']);
    grunt.registerTask('default', ['minify-css', 'minify-js', 'minify-img', 'minify-font', 'copy-view', 'filerev_replace', 'clean:temp']);
};
