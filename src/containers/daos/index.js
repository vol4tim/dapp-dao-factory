import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Daos from '../../components/daos';
import * as DaosActions from '../../actions/DaosActions'
import * as ModelsActions from '../../actions/ModelsActions'
import { getDaos } from '../../selectors/daos';

class DaosConteiner extends Component {
    componentWillMount() {
        this.props.load()
    }

    render() {
        return <Daos {...this.props} />
    }
}

function mapStateToProps(state) {
    var items = getDaos(state)
    return {
        items
    }
}

function mapDispatchToProps(dispatch) {
    const daosActions = bindActionCreators(DaosActions, dispatch);
    const modelsActions = bindActionCreators(ModelsActions, dispatch);
    return {
        load: daosActions.load,
        update: modelsActions.update
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DaosConteiner)
