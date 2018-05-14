const watchTargets = [
	{
		paths: ['source/images/**/*', 'source/fonts/**/*'],
		taskName: 'static'
	},
	{
		paths: ['source/*.html'],
		taskName: 'html'
	},
	{
		paths: ['source/css/**/*.css'],
		taskName: 'css'
	},
	{
		paths: ['source/js/**/*.js'],
		taskName: 'js'
	},
	{
		paths: [
			'source/_patterns/**/*.mustache',
			'source/_data/*.json',
			'source/_meta/*.mustache'
		],
		taskName: 'patternlab'
	}
];

module.exports = watchTargets;