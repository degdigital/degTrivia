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
			timer: null
		});
		return newDbRef;
	}

	function addDbRefListener(ref) {
		ref.on('value', snapshot => onRefValueChange(ref, snapshot.val()));
	}

	function onRefValueChange(ref, copyObj) {
		copyArray = getCopyArray(copyObj);
		if (copyArray && Array.isArray(copyArray) && copyArray.length > 0) {
			if (initialDataHasLoaded === false) {
				initialDataHasLoaded = true;
				replaceContent(element, copyArray[0]);
			}
			if (copyArray.length > 1) {
				startTimer(ref);
			} else {
				stopTimer(ref);
				replaceContent(element, copyArray[0]);
			}
		} else {
			replaceContent(element, '');
		}

		
	}

	function startTimer(ref) {
		if (!ref.timer) {
			ref.timer = setInterval(() => {
				const copyCount = copyArray.length;
				if (copyCount > 1) {
					currentIndex = currentIndex + 2 <= copyCount ? currentIndex + 1 : 0;
					replaceContent(element, copyArray[currentIndex]);
				}
			}, rotateDelay);
		}
	}

	function stopTimer(ref) {
		if (ref.timer) {
			clearInterval(ref.timer);
			ref.timer = null;
		}
	}

	function getCopyArray(copyObj = null) {
		if (!copyObj) {
			return [];
		}
		return Object.keys(copyObj).map(key => copyObj[key]);
	}

	function removebRefListener(ref) {
		if (ref) {
			ref.off();
		}
	}

	function teardown() {
		dbRefs.forEach(dbRef => {
			removebRefListener(dbRef.ref);
			stopTimer(dbRef);
		});
		dbRefs = [];
	}

	return {
		start,
		teardown
	}

};

export default rotatingCopy;