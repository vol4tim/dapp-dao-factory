import React, { PropTypes, Component } from 'react'

export default class ModuleComplete extends Component {
    render() {
        const { name, description, address } = this.props

        return <div className="panel panel-default">
            <div className="panel-heading">Модуль "{name}" {description}</div>
            <div className="panel-body">
                Готово. Адрес: {address}
            </div>
        </div>
    }
}

ModuleComplete.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    address: PropTypes.string.isRequired
}
ModuleComplete.defaultProps = {
    description: ''
}
