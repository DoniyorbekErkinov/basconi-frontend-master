module.exports = {
    devServer: {
        disableHostCheck: true,
        port: 8080
    },
    publicPath: "/",
    pwa: {
        name: 'BASCONI',
        themeColor: '#030341',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',

        // configure the workbox plugin
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            // swSrc is required in InjectManifest mode.
            swSrc: './src/registerServiceWorker.js',
            // ...other Workbox options...
        }
    }
}