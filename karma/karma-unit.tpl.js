module.exports = function ( karma ) {
    karma.set({
        /**
         * From where to look for files, starting with the location of this file.
         */
        basePath: '../',

        /**
         * This is the list of file patterns to load into the browser during testing.
         */
        files: [
            {pattern: 'build/assets/*.json', included: false, served: true, watched: false},
            <% scripts.forEach( function ( file ) { %>'<%= file %>',
            <% }); %>
            'src/**/*.js',
            'src/**/*.coffee'
        ],
        exclude: [
            'src/assets/**/*.js'
        ],
        frameworks: [ 'jasmine' ],
        plugins: [ 'karma-jasmine', 'karma-junit-reporter', 'karma-Chrome-launcher', 'karma-coffee-preprocessor', 'karma-spec-reporter'],
        preprocessors: {
            '**/*.coffee': 'coffee'
        },

        /**
         * How to report, by default.
         */
        reporters: ['spec', 'junit'],

        // the default configuration
        junitReporter: {
            outputDir: 'test-reports', // results will be saved as $outputDir/$browserName.xml
            outputFile: 'test-results.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: '' // suite will become the package name attribute in xml testsuite element
        },

        /**
         * On which port should the browser connect, on which port is the test runner
         * operating, and what is the URL path for the browser to use.
         */
        port: 9018,
        urlRoot: '/',
        proxies: {
            '/assets/': '/base/build/assets/'

        },

        /**
         * Disable file watching by default.
         */
        autoWatch: false,

        /**
         * The list of browsers to launch to test on. This includes only "Firefox" by
         * default, but other browser names include:
         * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
         *
         * Note that you can also use the executable name of the browser, like "chromium"
         * or "firefox", but that these vary based on your operating system.
         *
         * You may also leave this blank and manually navigate your browser to
         * http://localhost:9018/ when you're running tests. The window/tab can be left
         * open and the tests will automatically occur there during the build. This has
         * the aesthetic advantage of not launching a browser every time you save.
         */
        browsers: [
            'Chrome'
        ]
    })
};

