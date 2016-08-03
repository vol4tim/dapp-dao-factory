import { combineReducers } from 'redux'
import app from './app'
import models from './models'
import daos from './daos'
import {reducer as formReducer} from 'redux-form';

export default combineReducers({
    app,
    models,
    daos,
    form: formReducer
})
