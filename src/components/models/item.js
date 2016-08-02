import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

export default class Item extends Component {
    render() {
        const { code, name, description } = this.props

        return <div className="col-md-12">
            <div className="panel panel-default">
                <div className="panel-heading">
                    {name}
                    <Link to={'/view/'+ code} className="btn btn-info btn-xs pull-right">Подробнее</Link>
                </div>
                <div className="panel-body">
                    {description}
                </div>
            </div>
        </div>
    }
}

Item.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
}
