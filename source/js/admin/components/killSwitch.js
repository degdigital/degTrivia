const killSwitch = function() {

	function render() {
		return `
			<div class="killswitch-wrapper">
				<label for="disableAll">Disable Application</label>
				<input class="killswitch-trigger" id="disableAll" name="disableAll" type="checkbox">
			</div>
		`;
	}

	return {
		render
	};
	
};

export default killSwitch;