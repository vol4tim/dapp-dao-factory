import { combineReducers } from 'redux'
import app from './app'
import models from './models'
import {reducer as formReducer} from 'redux-form';

export default combineReducers({
    app,
    models,
    form: formReducer
})
