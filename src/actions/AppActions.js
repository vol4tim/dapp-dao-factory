import { LOADER, SET_TITLE } from '../constants/App'

export function loader(loader) {
    return {
        type: LOADER,
        payload: loader
    }
}

export function setTitle(title) {
    return {
        type: SET_TITLE,
        payload: title
    }
}
