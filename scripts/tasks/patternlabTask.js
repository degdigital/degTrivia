const patternlab = require('@pattern-lab/patternlab-node');
const plConfig = require('../patternlab-config');

let patternlabInst = null;

function run() {
	console.log('Pattern Lab task started.');

	if(patternlabInst === null) {
		patternlabInst = patternlab(plConfig);
	}

	return patternlabInst.build({ cleanPublic: true })
		.then(() => {
			console.log('Pattern Lab task complete.');
			return true;
		})
		.catch(e => {
			console.error('Pattern Lab task failed.');
			return false;
		});
}

module.exports = {
	run
};