import _ from 'lodash'
import { LOAD, START_PROGRESS, UPDATE_PROGRESS } from '../constants/Models'

const initialState = {
    items: [],
    progress: {}
}

function normalize(model) {
    if (!_.has(model, 'core')) {
        model.core = {}
    } else {
        if (_.isString(model.core)) {
            model.core = {
                module_factory: model.core,
                description: '',
                address: ''
            }
        } else {
            if (!_.has(model.core, 'description')) {
                model.core.description = ''
            }
            if (!_.has(model.core, 'address')) {
                model.core.address = ''
            }
        }
    }
    if (_.has(model, 'modules')) {
        model.modules = _.map(model.modules, function(module) {
            if (!_.has(module, 'name') || !_.has(module, 'module_factory')) {
                return
            }
            if (!_.has(module, 'description')) {
                module.description = ''
            }
            if (!_.has(module, 'address')) {
                module.address = ''
            }
            if (!_.has(module, 'params')) {
                module.params = {}
            }
            if (!_.has(module, 'params_link')) {
                module.params_link = {}
            }
            return module
        })
    } else {
        model.modules = []
    }
    return model
}

export default function models(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            var items = _.map(action.payload, function(model) {
                return normalize(model)
            })
            return { ...state, items: items}

        case START_PROGRESS:
            return { ...state, progress: action.payload}

        case UPDATE_PROGRESS:
            var progress = {...state.progress}

            if (!_.isEmpty(progress.core) && action.payload.module_index == -1) {
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

            var status = 0
            if (action.payload.last) {
                status = 1
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
