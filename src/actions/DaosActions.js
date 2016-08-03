import { LOAD, ADD } from '../constants/Daos'
import Datastore from 'nedb'

var db = null;
if (db == null) {
    db = new Datastore({ filename: __dirname +'dapp.factory.db', autoload: true });
}

export function add(code, name, address, version) {
    return dispatch => {
        var doc = {
            code: code,
            name: name,
            address: address,
            version: version,
            time: Date.now()
        }
        db.insert(doc);
        dispatch({
            type: ADD,
            payload: doc
        })
    }
}

export function load() {
    return dispatch => {
        db.find({}).sort({ time: -1 }).limit(10).exec(function (err, docs) {
            if (err === null) {
                dispatch({
                    type: LOAD,
                    payload: docs
                })
            }
        });
    }
}
