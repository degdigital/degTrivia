import dbService from '../../services/dbService.js';
import leaderboardScreen from '../screens/leaderboardScreen.js';
import marketingScreen from '../screens/marketingMessage.js';

const screenRotator = function(el) {

    const marketingScreenInst = marketingScreen(el);
    const leaderboardScreenInst = leaderboardScreen(el);
    let cachedEventData;
	let cachedLeaderboardData;

    function bindListeners() {
        dbService.getDb().ref(`leaderboardCurrent`).on('value', snapshot => cachedLeaderboardData = snapshot.val());
        dbService.getDb().ref('activeEventId').on('value', snap => {
            if (snap.val()) {
                getEventData();
            }
        })
    }
    
    function init() {
        // get next game time, cache with event data, if active game changes, update next game time
        Promise.all([
            getLeaderboardData(),
            getEventData(),
            getNextGameTime()
        ]).then(resp => {
            cachedEventData.nextGameTime = resp[2] || null;
            startRotator()
        });

        bindListeners();
    }
    
    function startRotator() {
        let screenIndex = 0;
        let message = {
            index: 0,
            max: Object.keys(cachedEventData.tvCopy).length
        };
        marketingScreenInst.render(cachedEventData, message.index);
        message.index = message.index < message.max - 1 ? message.index + 1 : 0;
        setInterval(() => {
			if (screenIndex === 0) {
				leaderboardScreenInst.render(cachedLeaderboardData);
			} else {
                marketingScreenInst.render(cachedEventData, message.index);
                message.index = message.index < message.max - 1 ? message.index + 1 : 0;
			}
			screenIndex = Number(screenIndex == 0);
		}, 5000)
    }

    function getNextGameTime() {
        return dbService.getNextGameTime();
    }

	async function getLeaderboardData() {
		cachedLeaderboardData = await dbService.getLeaderboardData();
		return Promise.resolve();
	}

	async function getEventData() {
		const eventId = await dbService.getActiveEventId();
		if (eventId) {
			cachedEventData = await dbService.getEventById(eventId);
		}
		return Promise.resolve();
    }
    
    init();
}

export default screenRotator;