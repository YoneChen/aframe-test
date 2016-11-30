const path =  require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const debug = process.env.NODE_ENV !== 'production';
const entryMap = require('./entryMap.json');
module.exports = {
    entry: entryMap,
    output: {
        path: path.join(__dirname,'dist'),
        // publicPath: debug?'/dist/':path.join(__dirname,'dist/'),
        publicPath: '/dist/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].chunk.js'   //chunk生成的配置
    },
    resolve: {
        extensions: ['', '.js', '.css','.scss'],
    alias: {
      'css': path.resolve(__dirname, './src/css'),
      'js': path.resolve(__dirname, './src/js')
    }
  },
    module: {
        loaders: [
            {test:/\.css$/,loader:ExtractTextPlugin.extract('css!postcss')},
            {test:/\.js$/,loader:'babel'},
            {
                //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
                //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
                test: /\.html$/,
                loader: "html?attrs=img:src a-asset-item:src a-entity:src"
            }, {
                //文件加载器，处理文件静态资源
                test: /\.(dae|mtl|obj)$/,
                loader: 'file-loader?name=./components/[name].[ext]'
            }, {
                //文件加载器，处理文件静态资源
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=./fonts/[name].[ext]'
            }, {
                //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
                //如下配置，将小于8192byte的图片转成base64码
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
            }
        ]
    },
    plugins: [//HtmlWebpackPlugin，模板生成相关的配置，每个对于一个页面的配置，有几个写几个
        // new webpack.ProvidePlugin({ //加载jq
        //     $: 'jquery'
        // }),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin('css/[name].css'), //单独使用link标签加载css并设置路径，相对于output配置中的publicPath

        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            // favicon: './src/img/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
            filename: './views/index.html', //生成的html存放路径，相对于path
            template: './src/views/index.html', //html模板路径
            inject: 'body', //js插入的位置，true/'head'/'body'/false
            hash: true, //为静态资源生成hash值
            chunks: ['index'],//需要引入的chunk，不配置就会引入所有页面的资源
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }
        }),
        new webpack.HotModuleReplacementPlugin() //热加载
        ],
    postcss: function () {
        return [require('autoprefixer')];
    },
    //使用webpack-dev-server，提高开发效率
    devServer: {
        contentBase: './',
        host: 'localhost',
        port: 9009, //默认8080
        inline: true, //可以监控js变化
        hot: true, //热启动
    }
}
