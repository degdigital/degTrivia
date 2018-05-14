const rollup = require('rollup');
const nodeResolve =  require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');

const bundles = [
	{
		name: 'app',
		entryFilepath: 'source/js/index.js',
		bundleFilepath: 'public/js/app-bundle.js',
		noModulesBundleFilepath: 'public/js/app-bundle-nomodules.js'
	},
	{
		name: 'admin',
		entryFilepath: 'source/js/admin/index.js',
		bundleFilepath: 'public/js/admin-bundle.js',
		noModulesBundleFilepath: 'public/js/admin-bundle-nomodules.js'
	}
];

async function buildBundle(bundleInfo) {
	const inputOptions = {
		input: bundleInfo.entryFilepath,
		plugins: [
			replace({
	      		exclude: 'node_modules/**',
	      		ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'development'),
	    	}),
			babel({
				exclude: 'node_modules/**',
				runtimeHelpers: true
			}),
			nodeResolve(), 
			commonjs()
		]
	};

	try {
		const bundle = await rollup.rollup(inputOptions);

		const modulesPromise = bundle.write({
	    	file: bundleInfo.bundleFilepath,
	    	format: 'es'
	    });

	    const noModulesPromise = bundle.write({
	    	file: bundleInfo.noModulesBundleFilepath,
	    	name: bundleInfo.name,
	    	format: 'iife'
	    });

	    await modulesPromise;
	    await noModulesPromise;

		return true;
	} catch(e) {
		console.error(`Error building bundle file for "${bundleInfo.entryFilepath}"`, e);
		
		return false;
	}
}

async function run() {
	console.log('JS task started.');

	const promises = bundles.map(buildBundle);

	return Promise.all(promises)
		.then(success => {
			if(success) {
				console.log('JS task complete.');
			} else {
				console.error('JS task failed.');
			}
			return success;
		});
	
}

module.exports = {
	run
};