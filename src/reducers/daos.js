import { LOAD, ADD } from '../constants/Daos'

const initialState = {
    items: []
}

export default function models(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            return { ...state, items: action.payload}

        case ADD:
            var items = state.items
            items.unshift(action.payload)
            items.pop()
            return { ...state, items: [...items]}

        default:
			return state;
    }
}
