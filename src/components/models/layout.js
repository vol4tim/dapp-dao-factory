import React, { PropTypes } from 'react'

const Layout = function(props) {
    const { name, version, sidebar } = props

    return <div>
        <span className="label label-warning pull-right">{version}</span>
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
    sidebar: PropTypes.node.isRequired
}

export default Layout
