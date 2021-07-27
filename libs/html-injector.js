const { JSDOM } = require('jsdom');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const Injector = {
	async injectBaseHref(file, baseHref) {
		var dom = new JSDOM(await readFile(file, 'utf8'));
		dom.window.document.querySelector('head > base').setAttribute('href', baseHref);
		writeFile(file, dom.serialize());
		logger.info('HTML Injector: successfully inject base href');
	},
};

module.exports = Injector;
