import React, { PropTypes } from 'react'

const Layout = function(props) {
    const { name, version, action, sidebar } = props

    return <div>
        <div className="row">
            <div className="col-md-10 col-xs-10">
                <h1 style={{marginTop:0}}>{name}</h1>
            </div>
            <div className="col-md-2 col-xs-2 text-right">
                {action == 'update' &&
                    <span className="label label-info">обновление</span>
                }
                <span className="label label-warning">{version}</span>
            </div>
        </div>
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
