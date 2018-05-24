// Utils
import {replaceContent} from '../utils/domUtils.js';

// Services
import dbService from '../services/dbService.js';

const rotatingCopy = function(element) {

	const db = dbService.getDb();
	const rotateDelay = 5000;
	let initialDataHasLoaded = false;
	let dbRefs = [];
	let copyArray = [];
	let currentIndex = 0;
	let timer = null;

	function start({path}) {
		if (element && path) {
			setupDbRef(path);
		}
	}

	function setupDbRef(path) {
		const existingDbRef = dbRefs.find(ref => ref.path === path);
		if (!existingDbRef) {
			const addedDbRef = addDbRef(path);
			addDbRefListener(addedDbRef);
		}
	}

	function addDbRef(path) {
		const newDbRef = db.ref(path);
		dbRefs.push({
			path,
			ref: newDbRef,
		});
		return newDbRef;
	}

	function addDbRefListener(ref) {
		ref.on('value', snapshot => onRefValueChange(snapshot.val()));
	}

	function onRefValueChange(copyObj) {
		copyArray = getCopyArray(copyObj);
		if (copyArray && Array.isArray(copyArray) && copyArray.length > 0) {
			if (initialDataHasLoaded === false) {
				initialDataHasLoaded = true;
				replaceContent(element, copyArray[0]);
			}
			if (copyArray.length > 1) {
				startTimer();
			} else {
				stopTimer();
				replaceContent(element, copyArray[0]);
			}
		} else {
			replaceContent(element, '');
		}

		
	}

	function startTimer() {
		if (!timer) {
			timer = setInterval(() => {
				const copyCount = copyArray.length;
				if (copyCount > 1) {
					currentIndex = currentIndex + 2 <= copyCount ? currentIndex + 1 : 0;
					replaceContent(element, copyArray[currentIndex]);
				}
			}, rotateDelay);
		}
	}

	function stopTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function getCopyArray(copyObj = null) {
		if (!copyObj) {
			return [];
		}
		return Object.keys(copyObj).map(key => copyObj[key]);
	}

	function removebRefListener(ref) {
		dbRef.ref.off();
	}

	function teardown() {
		dbRefs.forEach(dbRef => removebRefListener(dbRef));
		dbRefs = [];
		stopTimer();
	}

	return {
		start,
		teardown
	}

};

export default rotatingCopy;