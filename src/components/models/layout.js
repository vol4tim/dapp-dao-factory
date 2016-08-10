import React, { PropTypes } from 'react'

const Layout = function(props) {
    const { name, version, action, sidebar } = props

    return <div>
        <span className="label label-warning pull-right">{version}</span>
        {action == 'update' &&
            <span className="label label-info pull-right">обновление</span>
        }
        <h1>{name}</h1>
        <div className="row">
            <div className="col-md-4">
                {sidebar}
            </div>
            <div className="col-md-8">
                {props.children}
            </div>
        </div>
    </div>
}

Layout.propTypes = {
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    sidebar: PropTypes.node.isRequired,
    action: PropTypes.string
}
Layout.defaultProps = {
    action: 'create'
}

export default Layout
