import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Daos from '../../components/daos';
import * as DaosActions from '../../actions/DaosActions'
import * as ModelsActions from '../../actions/ModelsActions'
import { getModelByCode } from '../../selectors/models';

class DaosConteiner extends Component {
    componentDidMount() {
        this.props.load()
    }

    render() {
        return <Daos {...this.props} />
    }
}

function mapStateToProps(state) {
    var items = _.map(state.daos.items, function(item) {
        var model = getModelByCode(state, item.code)
        if (model) {
            item.model = model
            if (_.has(model, 'url') && model.url != '') {
                var url_dapp = model.url
                url_dapp = url_dapp.replace(':address', item.address)
                item.url = url_dapp
            }
        }
        return item
    })
    return {
        items
    }
}

function mapDispatchToProps(dispatch) {
    const daosActions = bindActionCreators(DaosActions, dispatch);
    const modelsActions = bindActionCreators(ModelsActions, dispatch);
    return {
        load: daosActions.load,
        startUpdateProgress: modelsActions.startUpdateProgress
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DaosConteiner)
