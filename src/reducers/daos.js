import _ from 'lodash'
import { LOAD, ADD, UPDATE } from '../constants/Daos'

const initialState = {
    items: []
}

export default function daos(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            return { ...state, items: action.payload}

        case ADD:
            var items = state.items
            items.unshift(action.payload)
            items.pop()
            return { ...state, items: items}

        case UPDATE:
            var item = _.map(state.items, function(item) {
                if (item.address == action.payload.address) {
                    return {...item, ...action.payload}
                }
                return item
            })
            return { ...state, items: [...item]}

        default:
			return state;
    }
}
