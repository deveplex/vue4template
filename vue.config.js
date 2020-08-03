'use strict';
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');
const resolve = (dir) => path.resolve(__dirname, dir);

// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development';

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const cdn = {
    // 忽略打包的第三方库
    // externals: {
    //     vue: 'Vue',
    //     vuex: 'Vuex',
    //     'vue-router': 'VueRouter',
    //     axios: 'axios',
    // },

    // 通过cdn方式使用
    js: [
        'https://cdn.bootcss.com/vue/2.6.11/vue.runtime.min.js',
        'https://cdn.bootcss.com/vue-router/3.1.2/vue-router.min.js',
        'https://cdn.bootcss.com/vuex/3.1.2/vuex.min.js',
        'https://cdn.bootcss.com/axios/0.19.2/axios.min.js',
        'https://cdn.bootcss.com/moment.js/2.24.0/moment.min.js',
        'https://cdn.bootcss.com/echarts/4.6.0/echarts.min.js',
    ],
    css: [],
};

module.exports = {
    //Deprecated since Vue CLI 3.3, please use publicPath instead
    //baseUrl: "~",

    // 项目部署的基础路径
    // 我们默认假设你的应用将会部署在域名的根部，
    // 比如 https://www.my-app.com/
    // 如果你的应用时部署在一个子路径下，那么你需要在这里
    // 指定子路径。比如，如果你的应用部署在
    // https://www.foobar.com/my-app/
    // 那么将这个值改为 `/my-app/`
    publicPath: './',

    // 将构建好的文件输出到哪里（或者说将编译的文件）
    outputDir: 'dist',

    // 输出静态资源的根 outputDir/(js/css/img/font/...)
    assetsDir: '',

    // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径
    //indexPath: 'index.html',

    // 用于多页配置，默认是 undefined
    pages: {
        index: {
            // 入口文件
            entry: 'src/main.js',　　/*这个是根入口文件*/
            // 模板文件
            template: 'public/index.html',
            // 输出文件
            filename: 'index.html',
            // 页面title
            title: 'Index Page'
        },

        // 简写格式
        // 模板文件默认是 `public/subpage.html`
        // 如果不存在，就是 `public/index.html`.
        // 输出文件默认是 `subpage.html`.
        //subpage: 'src/main.js'　　　　/*注意这个是*/
    },

    // 是否在保存的时候使用 `eslint-loader` 进行检查。
    // 有效的值：`ture` | `false` | `"error"`
    // 当设置为 `"error"` 时，检查出的错误会触发编译失败。
    lintOnSave: true,

    // 使用带有浏览器内编译器的完整构建版本
    // 查阅 https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时
    runtimeCompiler: false,

    // babel-loader 默认会跳过 node_modules 依赖。
    // 通过这个选项可以显式转译一个依赖。
    transpileDependencies: [/* string or regex */],

    // 是否为生产环境构建生成 source map？
    productionSourceMap: false,

    // 调整内部的 webpack 配置。
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/webpack.md
    chainWebpack: (config) => {
        config.module
            .rule('swf')
            .test(/\.swf$/)
            .use('url-loader')
            .loader('url-loader')
            .tap((options) => {
                return {
                    limit: 10000,
                };
            });

        // 添加别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('vue$', 'vue/dist/vue.esm.js');

        // 移除 prefetch 插件
        config.plugins.delete('prefetch-index');

        // 移除 preload 插件，避免加载多余的资源
        config.plugins.delete('preload-index');

        // config.plugin('copy')
        //     .tap((args) => {
        //         args[0][0].to = '';
        //         return args;
        //     });

        // vue-cli3引用的html-webpack-plugin默认配置
        //--  constructor (options) {
        //--     // Default options
        //--     this.options = _.extend({
        //--       template: path.join(__dirname, 'default_index.ejs'),
        //--       templateParameters: templateParametersGenerator,
        //--       filename: 'index.html',
        //--       hash: false,
        //--       inject: true,
        //--       compile: true,
        //--       favicon: false,
        //--       minify: false,
        //--       cache: true,
        //--       showErrors: true,
        //--       chunks: 'all',
        //--       excludeChunks: [],
        //--       chunksSortMode: 'auto',
        //--       meta: {},
        //--       title: 'Webpack App',
        //--       xhtml: false
        //--     }, options);
        //--   }

        // config.plugin('html')
        //     .use(HtmlWebpackPlugin)
        //     .tap(options => {
        //         options.BASE_URL = 'sss'
        //         options.template = __dirname + '/public/index.html'
        //         options.title = 'sssssssssssss'
        //         return options
        //     });

        // 配置cdn引入
        // config.plugin('html')
        //     .use(HtmlWebpackPlugin)
        //     .tap((args) => {
        //         args[0] = {
        //             cdn: cdn
        //         };
        //         return args;
        //     });
    },

    // 这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。
    configureWebpack: (config) => {
        // 忽略打包配置
        //config.externals = cdn.externals;
        // 生产环境相关配置
        if (isProduction) {
            //gzip压缩
            const productionGzipExtensions = ['html', 'js', 'css'];
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240, // 只有大小大于该值的资源会被处理 10240
                    minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                    deleteOriginalAssets: false, // 删除原文件
                })
            );
            // 公共代码抽离
            config.optimization = {
                // 分割代码块
                splitChunks: {
                    cacheGroups: {
                        //公用模块抽离
                        common: {
                            chunks: 'initial',
                            minSize: 0, //大于0个字节
                            minChunks: 2, //抽离公共代码时，这个代码块最小被引用的次数
                        },
                        //第三方库抽离
                        vendor: {
                            priority: 1, //权重
                            test: /node_modules/,
                            chunks: 'initial',
                            minSize: 0, //大于0个字节
                            minChunks: 2, //在分割之前，这个代码块最小应该被引用的次数
                        },
                    },
                },
            };
        }
    },

    // 配置 webpack-dev-server 行为。
    devServer: {
        overlay: {
            warnings: false,
            errors: false,
        },

        hot: true,
        open: true,
        compress: true,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: false,
        },

        // host: 'localhost',
        host: '0.0.0.0',
        port: 8089,
        https: false,
        hotOnly: true,
        proxy: {
            '/api': {
                // 代理地址,'http://localhost:8880'
                target: 'http://localhost:8889',//process.env.VUE_APP_API,

                // 是否跨域
                changeOrigin: true,

                secure: false,

                //websocket支持
                // ws: true,

                pathRewrite: {
                    '^/api': '/api/ctrl', //测试环境
                    //'^/api': '/static/mock'   //本地联调 请求数据路径别名,这里是注意将static/mock放入public文件夹
                },
            },
        },

        before: app => { }
    },

    // CSS 相关选项
    css: {
        // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
        // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
        extract: true,

        // 是否开启 CSS source map？
        sourceMap: false,

        // 为预处理器的 loader 传递自定义选项。比如传递给
        // sass-loader 时，使用 `{ sass: { ... } }`。
        loaderOptions: {
            sass: {
                prependData: `@import "~@/assets/scss/variables.scss";`,
            },
        },

        // 为所有的 CSS 及其预处理文件开启 CSS Modules。
        // 这个选项不会影响 `*.vue` 文件。
        // modules: false, // v4 起已弃用
        requireModuleExtension: true
    },

    // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
    // 在多核机器下会默认开启。
    parallel: require('os').cpus().length > 1,

    // PWA 插件的选项。
    // 查阅 https://github.com/vuejs/vue-cli/tree/dev/packages/@vue/cli-plugin-pwa
    pwa: {},

    // 三方插件的选项
    pluginOptions: {}
};