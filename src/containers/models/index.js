import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Models from '../../components/models';
import * as ModelsActions from '../../actions/ModelsActions'

export default class ModelsConteiner extends Component {
    componentDidMount() {
        this.props.load()
    }

    render() {
        return (
            <Models {...this.props} />
        )
    }
}

function mapStateToProps(state) {
    return {
        items: state.models.items
    }
}

function mapDispatchToProps(dispatch) {
    const modelsActions = bindActionCreators(ModelsActions, dispatch);
    return {
        load: modelsActions.load
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelsConteiner)
