import _ from 'lodash'
import { getModelByCode } from './models'

export function getDaos(state) {
    return _.map(state.daos.items, function(item) {
        var model = getModelByCode(state, item.code)
        if (model) {
            if (_.has(model, 'url') && model.url != '') {
                item.url = model.url.replace(':address', item.address)
            }
            item.model_version = model.version
        }
        return item
    })
}
