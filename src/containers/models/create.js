import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import Layout from '../../components/models/layout';
import Sidebar from '../../components/models/sidebar';
import NotFound from '../../components/models/notFound';
import ModuleComplete from '../../components/models/moduleComplete'
import ModuleForm from '../../components/models/moduleForm'
import ModuleRemove from '../../components/models/moduleRemove'
import Done from '../../components/models/done'
import * as ModelsActions from '../../actions/ModelsActions'
import { getModelByCode } from '../../selectors/models';

export default class CreateConteiner extends Component {

    componentWillMount() {
        this.load(this.props.progress)
    }

    componentWillUpdate(nextProps) {
        this.load(nextProps.progress)
    }

    load(progress) {
        const { model, code, create, loadData, loadDataUpdate } = this.props

        if (model) {
            create(code, false)
            if (!_.isEmpty(progress) && progress.status == 0) {
                if (progress.action == 'create') {
                    loadData(progress)
                } else {
                    loadDataUpdate(progress)
                }
            }
        }
    }

    getProgress() {
        const { progress, createModule, removeModule } = this.props
        const { factory, core, modules } = progress

        var progress_view = []

        // если есть модуль core
        if (!_.isEmpty(core)) {
            // если core готов
            if (core.address!='') {
                // показываем вьюху готового шага
                progress_view.push(<ModuleComplete name="Core" module={core.module_factory} description={core.description} address={core.address} />)
            } else {
                var last = true
                if (modules.length>0) {
                    last = false;
                }
                // показываем форму core
                progress_view.push(<ModuleForm
                    name="Core"
                    module={core.module_factory}
                    description={core.description}
                    fields={core.fields}
                    params={core.params}
                    data={core.data}
                    disableds={(_.has(core, 'const')) ? _.keys(core.const) : []}
                    onSubmit={(values)=>createModule(factory, progress, -1, last, values)}
                />)
            }
        }

        if (_.isEmpty(core) || core.address!='') {
            // проходим по всем модулям
            _.each(modules, function(item, index) {
                // если модуль готовый
                if (item.address!='') {
                    // показываем вьюху готового шага
                    progress_view.push(<ModuleComplete name={item.name} module={item.module_factory} description={item.description} address={item.address} />)
                } else {
                    // показываем форму для модуля и завершаем цикл
                    var last = true
                    if (modules.length != (index + 1)) {
                        last = false;
                    }
                    if (item.action == 'remove') {
                        progress_view.push(<ModuleRemove
                            name={item.name}
                            module={item.module_factory}
                            description={item.description}
                            onSubmit={()=>removeModule(factory, progress, index, last)}
                        />)
                    } else {
                        progress_view.push(<ModuleForm
                            name={item.name}
                            module={item.module_factory}
                            description={item.description}
                            fields={item.fields}
                            params={item.params}
                            data={item.data}
                            disableds={(_.has(item, 'const')) ? _.keys(item.const) : []}
                            onSubmit={(values)=>createModule(factory, progress, index, last, values)}
                        />)
                    }
                    return false;
                }
            })
        }

        return progress_view;
    }

    render() {
        const { model, progress, code, create } = this.props

        if (!model) {
            return <NotFound />
        }

        // если progress пустой ни чего не показываем
        // если progress status 0 отправляем его наполнять данными для формы и погазываем индикатор загрузки
        // если progress status 1 отображаем формы
        // если progress status 2 отображаем готовый результат

        if (!_.isEmpty(progress)) {
            if (progress.status == 0) { // отправляем его наполнять данными для формы и пока погазываем индикатор загрузки
                return <p>загружаем формы</p>
            } else if (progress.status == 1) {
                var progress_view = this.getProgress().map(function(item, index) {
                    return <div key={index}>{item}</div>
                })
                return <Layout {...progress}
                    sidebar={<Sidebar {...progress} />}
                    children={progress_view} />
            } else if (progress.status == 2) {
                var done_view;
                if (!_.isEmpty(progress.core)) {
                    done_view = <Done url_dapp={progress.url} address={progress.core.address} />
                } else {
                    done_view = <Done url_dapp={progress.url} />
                }
                var link_create = <button className="btn btn-default" onClick={()=>create(code)}>Создать еще</button>
                return <Layout {...progress}
                    sidebar={<Sidebar {...progress} link_create={link_create} />}
                    children={done_view} />
            }
        }
        return <p>...</p>
    }
}

function mapStateToProps(state, props) {
    const progress = state.models.progress
    const model = getModelByCode(state, props.params.code);
    return {
        model,
        progress,
        code: props.params.code
    }
}

function mapDispatchToProps(dispatch) {
    const modelsActions = bindActionCreators(ModelsActions, dispatch);
    return {
        create: modelsActions.create,
        loadData: modelsActions.loadData,
        loadDataUpdate: modelsActions.loadDataUpdate,
        createModule: modelsActions.createModule,
        removeModule: modelsActions.removeModule
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateConteiner)
