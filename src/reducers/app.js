import { SET_TITLE } from '../constants/App'

const initialState = {
    title: 'Dapp DAO factory'
}

export default function app(state = initialState, action) {
    switch (action.type) {
		case SET_TITLE:
			return { ...state, title: action.payload}

        default:
			return state;
    }
}
