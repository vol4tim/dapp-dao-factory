import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Layout from '../../components/models/layout';
import Sidebar from '../../components/models/sidebar';
import NotFound from '../../components/models/notFound';
import { getModelByCode } from '../../selectors/models';

const ViewConteiner = function(props) {
    const { model } = props

    if (!model) {
        return <NotFound />
    }
    return <Layout {...model}
        sidebar={<Sidebar {...model}
        link_create={<Link to={'/create/'+ model.code} className="btn btn-default">Создать</Link>} />}
        children={<p>{model.description}</p>} />
}

function mapStateToProps(state, props) {
    const model = getModelByCode(state, props.params.code);
    return {
        model
    }
}

export default connect(mapStateToProps)(ViewConteiner)
