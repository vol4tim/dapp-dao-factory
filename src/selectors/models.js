import _ from 'lodash'

export function getModelByCode(models, code) {
    var model = _.find(models, { 'code': code })
    if (model) {
        return normalize(model);
    }
    return false;
}

function normalize(model) {
    if (!_.has(model, 'core')) {
        model.core = {}
    }
    if (_.isString(model.core)) {
        model.core = {
            name: model.core,
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
    if (_.has(model, 'modules')) {
        model.modules = _.map(model.modules, function(module) {
            if (_.isString(module)) {
                return {
                    'name': module,
                    'description': '',
                    'address': '',
                    'params': {},
                    'params_link': {}
                }
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
