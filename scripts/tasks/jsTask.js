const rollup = require('rollup');
const nodeResolve =  require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
//const babel = require('rollup-plugin-babel');

const entryFilepath = 'source/js/main.js';
const bundleFilepaths = {
	modules: 'public/js/main-bundle.js',
	noModules: 'public/js/main-bundle-nomodules.js'
};

async function run() {
	console.log('JS task started.');

	const inputOptions = {
		input: entryFilepath,
		plugins: [
			/*babel({
				exclude: 'node_modules/**'
			}),*/
			nodeResolve(), 
			commonjs()
		]
	};

	try {
		const bundle = await rollup.rollup(inputOptions);

		const modulesPromise = bundle.write({
	    	file: bundleFilepaths.modules,
	    	format: 'es'
	    });

	    const noModulesPromise = bundle.write({
	    	file: bundleFilepaths.noModules,
	    	format: 'iife'
	    });

	    await modulesPromise;
	    await noModulesPromise;

		console.log('JS task complete.');
		return true;
	} catch(e) {
		console.error('Error building bundle file', e);
		console.error('JS task failed.');
		return false;
	}
}

module.exports = {
	run
};