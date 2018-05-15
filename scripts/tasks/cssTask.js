const path = require('path');
const fse = require('fs-extra');
const postcss = require('postcss');

const plugins = [
	require('postcss-easy-import'),  
	require('postcss-custom-properties')({preserve: false}),
	require('postcss-color-function'),
	require('postcss-nested'),
	require('autoprefixer'),
	require('cssnano')
];
const filesToProcess = [
	'main.css',
	'admin.css'
];

function processFile(srcFilepath, destFilepaths, plugins) {
	return fse.readFile(srcFilepath)
		.then(contents =>
			postcss(plugins).process(contents, {
				from: srcFilepath
			})
		)
		.then(result => {
			const promises = destFilepaths.map(destFilepath => 
				fse.outputFile(destFilepath, result.css));

			return Promise.all(promises);
		})
		.then(() => true)
		.catch(e => {
			console.error(`Error processing CSS file "${srcFilepath}":`, e);
			return false;
		});
};

function run() {
	console.log('CSS task started.');

	const promises = filesToProcess.map(file => {
		const srcFilepath = path.resolve('source/css', file);
		const destFilepaths = [
			path.resolve('public/css', file),
			path.resolve('patternlab/css', file)
		];
		return processFile(srcFilepath, destFilepaths, plugins);
	});

	return Promise.all(promises)
		.then(results => {
			const success = results.every(result => result);
			if(success) {
				console.log('CSS task complete.');
			} else {
				console.error('CSS task failed.');
			}
			return success;
		});
}

module.exports = {
	run
};