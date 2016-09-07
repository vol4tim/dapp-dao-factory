import React, { PropTypes, Component } from 'react'

class ModuleRemove extends Component {
    render() {
        const { name, module, description, onSubmit } = this.props

        return <div className="panel panel-default">
            <div className="panel-heading">{name} | Модуль "{module}" {description}</div>
            <div className="panel-body">
                <p>Удаление модуля</p>
                <input
                    type='submit'
                    className="btn btn-default"
                    onClick={onSubmit}
                    value="Подтвердить"
                    />
            </div>
        </div>
    }
}

ModuleRemove.propTypes = {
    name: PropTypes.string.isRequired,
    module: PropTypes.string.isRequired,
    description: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
}
ModuleRemove.defaultProps = {
    description: ''
}

export default ModuleRemove
