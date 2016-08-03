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

            if (!_.isEmpty(progress.core) && action.payload.module_index == 0) {
                var core = {...progress.core, address: action.payload.address}
                progress = {...progress, core: core}
            } else {
                var modules = _.map(progress.modules, function(item, index) {
                    if (index == action.payload.module_index) {
                        return {...item, address: action.payload.address};
                    }
                    return item;
                })
                progress = {...progress, modules: modules}
            }

            // если есть модуль core и если core еще не готов
            if (!_.isEmpty(progress.core) && progress.core.address=='') {
                status = 0
            } else {
                // проходим по всем модулям
                _.each(progress.modules, function(item) {
                    // если модуль не готов
                    if (item.address=='') {
                        status = 0
                        return false;
                    }
                })
            }

            // перепривязываем готовые модули, чтоб в форме уже были заполнены поля
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
