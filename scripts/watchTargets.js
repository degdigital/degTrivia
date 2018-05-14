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
	}
];

module.exports = watchTargets;