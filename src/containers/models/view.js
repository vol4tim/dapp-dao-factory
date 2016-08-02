import { connect } from 'react-redux'
import _ from 'lodash'
import View from '../../components/models/view';

function mapStateToProps(state, props) {
    const model = _.find(state.models.items, { 'code': props.params.code });
    if (_.has(model, 'core') && _.isString(model.core)) {
        model.core = {
            name: model.core,
            description: ''
        }
    } else if (!_.has(model.core, 'description')) {
        model.core.description = ''
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
    }
    return {
        ...model
    }
}

export default connect(mapStateToProps)(View)
