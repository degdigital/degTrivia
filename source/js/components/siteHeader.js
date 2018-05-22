function renderGameHashtag(gameHashtag, showGameHashtag) {
	return showGameHashtag ? `<div class="game-hashtag">${gameHashtag}</div>` : '';
}

export default function siteHeader({gameHashtag, showGameHashtag}) {
	return `
		<header role="banner" class="site-header page-width">
			<img src="/images/deg-logo.svg" alt="DEG logo" class="logo" />
			${renderGameHashtag(gameHashtag, showGameHashtag)}
		</header>
	`;
}