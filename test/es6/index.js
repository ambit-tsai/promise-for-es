const Mocha = require("mocha");
require('mochawesome/register');


const mocha = new Mocha({
    parallel: true,
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: `${__dirname}/report`,
        reportFilename: 'index',
        quiet: true,
        json: false,
    },
    timeout: 1000,
});
mocha.addFile(`${__dirname}/test.js`);
mocha.run();