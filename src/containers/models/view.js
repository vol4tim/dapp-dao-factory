import React, { Component } from 'react'
import { connect } from 'react-redux'
import View from '../../components/models/view';
import NotFound from '../../components/models/notFound';
import { getModelByCode } from '../../selectors/models';

export default class ViewConteiner extends Component {
    render() {
        var component;
        if (!this.props.model) {
            component = <NotFound />
        } else {
            component = <View {...this.props.model} />
        }
        return component
    }
}

function mapStateToProps(state, props) {
    const model = getModelByCode(state.models.items, props.params.code);
    return {
        model
    }
}

export default connect(mapStateToProps)(ViewConteiner)
