import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const Item = function(props) {
    const { code, name, address, version, url, model_version, update } = props

    var css_style = 'label-warning';
    if (version!=model_version) {
        css_style = 'label-danger';
    }

    return <div className="col-md-12">
        <div className="panel panel-default">
            <div className="panel-body">
                <span className={'label '+ css_style +' pull-right'}>{version}</span>
                <h2 style={{marginTop: 0}}>{name}</h2>
                <p>адрес: <span className="label label-success">{address}</span></p>
                <Link to={'/view/'+ code} className="btn btn-info btn-xs">Подробнее о модели</Link>
                {url!='' &&
                    <a href={url} className="btn btn-info btn-xs" style={{marginLeft:10}}>Просмотреть DAO</a>
                }
                {model_version!='' &&
                    <p className="pull-right">
                        Доступная версия модели: <span className="label label-success">{model_version}</span>
                        {model_version != version &&
                            <button onClick={update} className="glyphicon glyphicon-retweet pull-right" style={{marginLeft: 5}}></button>
                        }
                    </p>
                }
            </div>
        </div>
    </div>
}

Item.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    model_version: PropTypes.string.isRequired,
    url: PropTypes.string,
    update: PropTypes.func.isRequired
}
Item.defaultProps = {
    url: ''
}
