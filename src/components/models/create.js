import React, { PropTypes, Component } from 'react'
import _ from 'lodash'
import ModuleComplete from './ModuleComplete'
import ModuleForm from './ModuleForm'
import Done from './Done'

export default class Create extends Component {
    componentDidMount() {
        const { code, progress } = this.props
        if (_.isEmpty(progress) || progress.code != code) {
            this.startProgress()
        }
    }

    startProgress() {
        const { code, factory, core, modules } = this.props
        this.props.startProgress(code, factory, core, modules);
    }

    getProgress() {
        const { code, factory, url, progress, submitStep } = this.props

        var progress_view = []
        if (!_.isEmpty(progress) && progress.code == code) {
            if (progress.status == 0) {
                var status = 1

                // если есть модуль core
                if (!_.isEmpty(progress.core)) {
                    // если core готов
                    if (progress.core.address!='') {
                        // показываем вьюху готового шага
                        progress_view.push(<ModuleComplete name={progress.core.name} description={progress.core.description} address={progress.core.address} />)
                    } else {
                        // показываем форму core
                        progress_view.push(<ModuleForm
                            name={progress.core.name}
                            description={progress.core.description}
                            fields={progress.core.fields}
                            params={progress.core.params}
                            data={progress.core.data}
                            onSubmit={(values)=>submitStep(factory, progress, 0, values)}
                        />)
                        status = 0
                    }
                }

                if (_.isEmpty(progress.core) || progress.core.address!='') {
                    // проходим по всем модулям
                    _.each(progress.modules, function(item, index) {
                        // если модуль готовый
                        if (item.address!='') {
                            // показываем вьюху готового шага
                            progress_view.push(<ModuleComplete name={item.name} description={item.description} address={item.address} />)
                        } else {
                            // показываем форму для модуля и завершаем цикл
                            status = 0
                            progress_view.push(<ModuleForm
                                name={item.name}
                                description={item.description}
                                fields={item.fields}
                                params={item.params}
                                data={item.data}
                                onSubmit={(values)=>submitStep(factory, progress, index, values)}
                            />)
                            return false;
                        }
                    })
                }

                if (status == 1) {
                    console.log('все готово делать нечего');
                }
            } else {
                // показываем результат
                if (!_.isEmpty(progress.core)) {
                    progress_view.push(<Done url_dapp={url} address={progress.core.address} />)
                } else {
                    progress_view.push(<Done url_dapp={url} />)
                }
            }
        }
        return progress_view;
    }

    render() {
        const { name, core, modules, progress } = this.props
        const progress_view = this.getProgress()

        return <div>
            <h1>{name}</h1>
            <div className="row">
                <div className="col-md-4">
                    <ul className="list-group">
                        <li className="list-group-item active">Модули:</li>
                        {!_.isEmpty(core) &&
                            <li className={(!_.isEmpty(progress.core) && progress.core.name == core.name && progress.core.address!='') ? 'list-group-item list-group-item-success': 'list-group-item'}>
                                {core.name}
                            </li>
                        }
                        {modules.map(function(item, index) {
                            var css = 'list-group-item'
                            if (!_.isEmpty(progress)) {
                                var module = progress.modules[index]
                                if (module && module.address!='') {
                                    css = 'list-group-item list-group-item-success'
                                }
                            }
                            return <li key={index} className={css}>{item.name}</li>
                        })}
                    </ul>
                    {progress.status==1 &&
                        <button className="btn btn-default" onClick={this.startProgress.bind(this)}>Создать еще</button>
                    }
                </div>
                <div className="col-md-8">
                    {progress_view.map(function(item, index) {
                        return <div key={index}>{item}</div>
                    })}
                </div>
            </div>
        </div>
    }
}

Create.propTypes = {
    code: PropTypes.string.isRequired,
    factory: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    core: PropTypes.object,
    modules: PropTypes.array,
    progress: PropTypes.object.isRequired,
    startProgress: PropTypes.func.isRequired,
    submitStep: PropTypes.func.isRequired
}
Create.defaultProps = {
    url: '',
    core: {},
    modules: []
}
