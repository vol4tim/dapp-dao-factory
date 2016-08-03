import React, { PropTypes, Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router'

export default class View extends Component {
    render() {
        const { code, name, description, core, modules } = this.props

        return <div>
            <h1>{name}</h1>
            <div className="row">
                <div className="col-md-4">
                    <ul className="list-group">
                        <li className="list-group-item active">Модули:</li>
                        {!_.isEmpty(core) && <li className="list-group-item">{core.name}</li>}
                        {modules.map(function(item) {
                            return <li key={item.name} className="list-group-item">{item.name}</li>
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
}

View.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    core: PropTypes.object,
    modules: PropTypes.array
}
View.defaultProps = {
    core: {},
    description: '',
    modules: []
}
