function getFromLocalStorage(key = null) {
	try {
		return localStorage.getItem(key);
	} catch(error) {
		console.error(error);
		return false;
	}
}

function saveToLocalStorage(key, val) {
	try {
		localStorage.setItem(key, val);
		return true;
	} catch(error) {
		console.error(error);
		return false;
	}
}

function removeFromLocalStorage(key) {
	try {
		localStorage.removeItem(key);
		return true;
	} catch(error) {
		console.error(error);
		return false;
	}
}

export { 
    getFromLocalStorage, 
    saveToLocalStorage, 
    removeFromLocalStorage
};