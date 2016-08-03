import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import Create from '../../components/models/create';
import NotFound from '../../components/models/notFound';
import { getModelByCode } from '../../selectors/models';
import * as ModelsActions from '../../actions/ModelsActions'

export default class ViewConteiner extends Component {
    render() {
        var component;
        if (!this.props.model) {
            component = <NotFound />
        } else {
            var model = this.props.model;
            _.unset(this.props, 'model');
            component = <Create {...model} {...this.props} />
        }
        return component
    }
}

function mapStateToProps(state, props) {
    const model = getModelByCode(state.models.items, props.params.code);
    return {
        model,
        progress: state.models.progress
    }
}

function mapDispatchToProps(dispatch) {
    const modelsActions = bindActionCreators(ModelsActions, dispatch);
    return {
        startProgress: modelsActions.startProgress,
        submitStep: modelsActions.submitStep
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewConteiner)
