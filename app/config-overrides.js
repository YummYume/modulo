module.exports = {
    webpackDevMiddleware: config => {
        // Don't ignore all node modules.
        config.watchOptions.ignored = config.watchOptions.ignored.filter(
            ignore => !ignore.toString().includes('node_modules')
        );

        // Ignore all node modules except those here.
        config.watchOptions.ignored = [
            ...config.watchOptions.ignored,
            /node_modules([\\]+|\/)+(?!my-node-module)/,
            /\my-node-module([\\]+|\/)node_modules/
        ];

        config.watchOptions.poll = 1000;

        return config;
    },
}
