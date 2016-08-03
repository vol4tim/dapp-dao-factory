import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Daos from '../../components/daos';
import * as DaosActions from '../../actions/DaosActions'

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
        var model = _.find(state.models.items, {code: item.code})
        if (model && _.has(model, 'url') && model.url != '') {
            var url_dapp = model.url
            url_dapp = url_dapp.replace(':address', item.address)
            item.url = url_dapp
        }
        return item
    })
    return {
        items
    }
}

function mapDispatchToProps(dispatch) {
    const daosActions = bindActionCreators(DaosActions, dispatch);
    return {
        load: daosActions.load
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DaosConteiner)
