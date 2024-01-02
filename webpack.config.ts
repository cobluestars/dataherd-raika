const path = require('path');
const webpack = require('webpack');

const config = {
    entry: './src/trackUserEvents.js',
    mode: 'production', // 'production' 모드로 변경 시 최적화된 코드 생성, 'development': 개발 모드
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        library: 'dataherd-raika',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-typescript',
                            ],
                        },
                    },
                ]
            }
        ]
    },
    target: 'web' // 라이브러리가 웹 환경을 위한 것이므로 'web'으로 설정
};

module.exports = config;