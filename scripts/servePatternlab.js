const patternlab = require('@pattern-lab/patternlab-node');
const plConfig = require('./patternlab-config');

let patternlabInst = null;

function serve() {
	if(patternlabInst === null) {
		patternlabInst = patternlab(plConfig);
	}

	patternlabInst.serve({cleanPublic: true});
}

serve();