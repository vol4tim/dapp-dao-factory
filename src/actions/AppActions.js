import { SET_TITLE } from '../constants/App'

export function setTitle(title) {
    return {
        type: SET_TITLE,
        payload: title
    }
}
