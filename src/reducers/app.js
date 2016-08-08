import { LOADER, SET_TITLE } from '../constants/App'

const initialState = {
    title: 'Dapp DAO factory',
    loader: true
}

export default function app(state = initialState, action) {
    switch (action.type) {
		case LOADER:
			return { ...state, loader: action.payload}

		case SET_TITLE:
			return { ...state, title: action.payload}

        default:
			return state;
    }
}
