import _ from 'lodash'

export function getModelByCode(state, code) {
    var model = _.find(state.models.items, { 'code': code })
    if (model) {
        return model;
    }
    return false;
}
