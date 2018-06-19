const rollup = require('rollup');
const nodeResolve =  require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const globals = require('rollup-plugin-node-globals');

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
	},
	{
		name: 'leaderboard',
		entryFilepath: 'source/js/leaderboard/index.js',
		bundleFilepath: 'public/js/leaderboard-bundle.js',
		noModulesBundleFilepath: 'public/js/leaderboard-bundle-nomodules.js'
	}
];

async function buildBundle(bundleInfo) {
	const inputOptions = {
		input: bundleInfo.entryFilepath,
		external: [ 'node_modules/react', 'node_modules/react-dom'],
		plugins: [
			replace({
	      		exclude: 'node_modules/**',
				ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'development'),
				BABEL_ENV: JSON.stringify(process.env.BABEL_ENV || 'development')
	    	}),
			babel({
				exclude: 'node_modules/**',
				runtimeHelpers: true
			}),
			nodeResolve(), 
			commonjs({
				namedExports: {
					'react': ['React'],
					'react-dom': ['ReactDOM']
				}
			}),
			globals()
		]
	};

	try {
		const bundle = await rollup.rollup(inputOptions);

		const modulesPromise = bundle.write({
	    	file: bundleInfo.bundleFilepath,
			format: 'es',
			globals: {
				react: 'React',
				'react-dom': 'ReactDOM'
			}
	    });

	    const noModulesPromise = bundle.write({
	    	file: bundleInfo.noModulesBundleFilepath,
	    	name: bundleInfo.name,
			format: 'iife',
			globals: {
				react: 'React',
				'react-dom': 'ReactDOM'
			}
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