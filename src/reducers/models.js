import _ from 'lodash'
import { LOAD, START_PROGRESS, UPDATE_PROGRESS } from '../constants/Models'

const initialState = {
    items: [],
    progress: {}
}

export default function models(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            return { ...state, items: action.payload}

        case START_PROGRESS:
            return { ...state, progress: action.payload}

        case UPDATE_PROGRESS:
            var status = 1
            var progress = state.progress

            if (!_.isEmpty(progress.core) && progress.core.name == action.payload.module) {
                var core = {...progress.core, address: action.payload.address}
                progress = {...progress, core: core}
            } else {
                var modules = _.map(progress.modules, function(item) {
                    if (item.name == action.payload.module) {
                        return {...item, address: action.payload.address};
                    }
                    return item;
                })
                progress = {...progress, modules: modules}
            }

            // если есть модуль core
            if (!_.isEmpty(progress.core)) {
                // если core готов
                if (progress.core.address=='') {
                    status = 0
                }
            }

            if (_.isEmpty(progress.core) || progress.core.address!='') {
                // проходим по всем модулям
                _.each(progress.modules, function(item) {
                    // если модуль готовый
                    if (item.address=='') {
                        status = 0
                        return false;
                    }
                })
            }

            // перепривязываем готовые модули
            progress.modules = _.map(progress.modules, function(item) {
                _.each(item.params_link, function(index, param) {
                    item.data[param] = progress.modules[index].address
                })
                return item
            })

            return { ...state, progress: {...progress, status: status}}

        default:
			return state;
    }
}
