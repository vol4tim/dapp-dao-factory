import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

export default class Item extends Component {
    update() {
        const { address, code, version, model } = this.props
        this.props.startUpdateProgress(version, address, model);
        this.context.router.push('/create/'+ code)
    }

    render() {
        const { code, name, address, version, url, model } = this.props

        var css_style = 'label-warning';
        if (version!=model.version) {
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
                    {model.version!='' &&
                        <p className="pull-right">
                            Доступная версия модели: <span className="label label-success">{model.version}</span>
                            {model.version != version &&
                                <button onClick={this.update.bind(this)} className="glyphicon glyphicon-retweet pull-right" style={{marginLeft: 5}}></button>
                            }
                        </p>
                    }
                </div>
            </div>
        </div>
    }
}

Item.contextTypes = {
  router: PropTypes.object.isRequired
}
Item.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    url: PropTypes.string,
    startUpdateProgress: PropTypes.func.isRequired
}
Item.defaultProps = {
    url: ''
}
