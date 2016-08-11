import _ from 'lodash'
import { LOAD, CREATE, UPDATE, LOAD_DATA, UPDATE_PROGRESS } from '../constants/Models'

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

        case CREATE:
            if (!_.isEmpty(state.items) && (_.isEmpty(state.progress) || state.progress.code != action.payload.code || (state.progress.status == 2 && action.payload.force))) {
                var progress_new = _.find(state.items, {code: action.payload.code})
                return { ...state, progress: {...progress_new, status: 0, action: 'create'}}
            }
            return state

        case UPDATE:
            if (!_.isEmpty(state.items)) {
                var progress_update = _.find(state.items, {code: action.payload.code})
                return { ...state, progress: {
                    ...progress_update,
                    core: {...progress_update.core, address: action.payload.address},
                    current_version: action.payload.version,
                    status: 0,
                    action: 'update'
                }}
            }
            return state

        case LOAD_DATA:
            return { ...state, progress: {...action.payload, status: 1}}

        case UPDATE_PROGRESS:
            var progress = {...state.progress}

            if (action.payload.module_index == -1) {
                progress.core.address = action.payload.address
            } else {
                progress.modules = _.map(progress.modules, function(item, index) {
                    if (index == action.payload.module_index) {
                        return {...item, address: action.payload.address};
                    }
                    return item;
                })
            }

            if (action.payload.last) {
                progress.status = 2
            }

            // перепривязываем готовые модули, чтоб в форме уже были заполнены поля
            progress.modules = _.map(progress.modules, function(item) {
                _.each(item.params_link, function(index, param) {
                    item.data[param] = progress.modules[index].address
                })
                return item
            })

            return { ...state, progress: progress}

        default:
			return state;
    }
}
