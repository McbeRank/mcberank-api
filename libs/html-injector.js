const { JSDOM } = require('jsdom');
const fs = require('fs');

const Injector = {
    async injectBaseHref(file, baseHref){
        new Promise(resolve => fs.readFile(file, 'utf8', (err, data) => {
            if(err) throw err;

            var dom = new JSDOM(data);
            dom.window.document.querySelector('head > base').setAttribute('href', baseHref);

            fs.writeFile(file, dom.serialize(), err => {
                if(err) throw err;

                logger.info('HTML Injector: successfully inject base href');
                resolve();
            });
        }));
    }
}

module.exports = Injector;