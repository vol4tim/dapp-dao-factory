import React, { PropTypes, Component } from 'react'

export default class Done extends Component {
    render() {
        const { address } = this.props
        var url_dapp = this.props.url_dapp;
        if (url_dapp!='') {
            url_dapp = url_dapp.replace(':address', address)
        }

        return <div className="panel panel-default">
            <div className="panel-body">
                Ваша модель DAO созданна.<br />
                Адрес DAO: {address}<br />
                {url_dapp!='' &&
                    <p>C DAO можно поработать с помощью dapp: <a href={url_dapp}>{url_dapp}</a></p>
                }
            </div>
        </div>
    }
}

Done.propTypes = {
    address: PropTypes.string,
    url_dapp: PropTypes.string
}
Done.defaultProps = {
    address: '',
    url_dapp: ''
}
