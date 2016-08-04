import React, { PropTypes } from 'react'
import _ from 'lodash'
import { Link } from 'react-router'

const View = function(props) {
    const { code, name, description, version, core, modules } = props

    return <div>
        <span className="label label-warning pull-right">{version}</span>
        <h1>{name}</h1>
        <div className="row">
            <div className="col-md-4">
                <ul className="list-group">
                    <li className="list-group-item active">Модули:</li>
                    {!_.isEmpty(core) && <li className="list-group-item">{core.name}</li>}
                    {modules.map(function(item, index) {
                        return <li key={index} className="list-group-item">{item.name}</li>
                    })}
                </ul>
                <Link to={'/create/'+ code} className="btn btn-default">Создать</Link>
            </div>
            <div className="col-md-8">
                <p>{description}</p>
            </div>
        </div>
    </div>
}

View.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    version: PropTypes.string.isRequired,
    core: PropTypes.object,
    modules: PropTypes.array
}
View.defaultProps = {
    core: {},
    description: '',
    modules: []
}

export default View
