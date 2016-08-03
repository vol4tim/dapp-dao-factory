import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

export default class Item extends Component {
    render() {
        const { code, name, address, version, url } = this.props

        return <div className="col-md-12">
            <div className="panel panel-default">
                <div className="panel-body">
                    <span className="label label-warning pull-right">{version}</span>
                    <h2 style={{marginTop: 0}}>{name}</h2>
                    <p>адрес: <span className="label label-success">{address}</span></p>
                    <Link to={'/view/'+ code} className="btn btn-info btn-xs">Подробнее о модели</Link>
                    {url!='' &&
                        <a href={url} className="btn btn-info btn-xs" style={{marginLeft:10}}>Просмотреть DAO</a>
                    }
                </div>
            </div>
        </div>
    }
}

Item.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    url: PropTypes.string
}
Item.defaultProps = {
    url: ''
}
