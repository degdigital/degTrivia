import {createStore, compose} from 'redux';
import rootReducer from './reducers';
import {reduxFirebase} from 'react-redux-firebase';

import fbConfig from '../config/firebaseConfig.js';

export default function configureStore (initialState, history) {
    const createStoreWithMiddleWare = compose(
        reduxFirebase(fbConfig, {userProfile: 'users'})
    )(createStore);

    const initialState = {};
    return createStoreWithMiddleWare(rootReducer, initialState);
}ßÍ