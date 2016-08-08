import React, { PropTypes } from 'react'
import _ from 'lodash'

const Sidebar = function(props) {
    const { core, modules, link_create } = props

    return <ul className="list-group">
        <li className="list-group-item active">Модули:</li>
        {!_.isEmpty(core) &&
            <li className={(core.address!='') ? 'list-group-item list-group-item-success': 'list-group-item'}>
                {core.name}
            </li>
        }
        {modules.map(function(item, index) {
            var css = 'list-group-item'
            if (item && item.address!='') {
                css = 'list-group-item list-group-item-success'
            }
            return <li key={index} className={css}>{item.name}</li>
        })}
        {link_create &&
            <li className="list-group-item">
                {link_create}
            </li>
        }
    </ul>
}

Sidebar.propTypes = {
    core: PropTypes.object,
    modules: PropTypes.array,
    link_create: PropTypes.node
}
Sidebar.defaultProps = {
    core: {},
    modules: []
}

export default Sidebar
