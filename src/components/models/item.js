import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const Item = function(props) {
    const { code, name, description } = props

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

Item.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
}

export default Item
