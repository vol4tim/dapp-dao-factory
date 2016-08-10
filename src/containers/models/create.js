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

import { getModelByCode } from '../../selectors/models';
import * as ModelsActions from '../../actions/ModelsActions'

export default class CreateConteiner extends Component {
    getProgress() {
        const { init, model, progress, startProgress, submitStep, removeStep } = this.props

        if (init) {
            startProgress('create', model)
        }

        const { factory, url, core, modules, status } = progress

        if (init || _.isUndefined(status)) {
            return [];
        }

        var progress_view = []
        if (status == 0) {
            var status_v = 1

            // если есть модуль core
            if (!_.isEmpty(core)) {
                // если core готов
                if (core.address!='') {
                    // показываем вьюху готового шага
                    progress_view.push(<ModuleComplete name="DAO" module={core.module_factory} description={core.description} address={core.address} />)
                } else {
                    var last = true
                    if (modules.length>0) {
                        last = false;
                    }
                    // показываем форму core
                    progress_view.push(<ModuleForm
                        name="DAO"
                        module={core.module_factory}
                        description={core.description}
                        fields={core.fields}
                        params={core.params}
                        data={core.data}
                        onSubmit={(values)=>submitStep(factory, progress, -1, last, values)}
                    />)
                    status_v = 0
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
                        status_v = 0
                        var last = true
                        if (modules.length != (index + 1)) {
                            last = false;
                        }
                        if (item.action == 'remove') {
                            progress_view.push(<ModuleRemove
                                name={item.name}
                                module={item.module_factory}
                                description={item.description}
                                onSubmit={()=>removeStep(factory, progress, index, last)}
                            />)
                        } else {
                            progress_view.push(<ModuleForm
                                name={item.name}
                                module={item.module_factory}
                                description={item.description}
                                fields={item.fields}
                                params={item.params}
                                data={item.data}
                                onSubmit={(values)=>submitStep(factory, progress, index, last, values)}
                            />)
                        }
                        return false;
                    }
                })
            }
        }

        if (status == 1 || status_v == 1) {
            if (!_.isEmpty(core)) {
                progress_view.push(<Done url_dapp={url} address={core.address} />)
            } else {
                progress_view.push(<Done url_dapp={url} />)
            }
        }

        return progress_view;
    }

    render() {
        if (!this.props.model) {
            return <NotFound />
        }
        var progress_view = this.getProgress().map(function(item, index) {
            return <div key={index}>{item}</div>
        })
        if (!_.isEmpty(this.props.progress)) {
            var link_create
            if (this.props.progress.status == 1) {
                link_create = <button className="btn btn-default" onClick={()=>this.props.startProgress('create', this.props.model)}>Создать еще</button>
            }
            return <Layout {...this.props.progress}
                sidebar={<Sidebar {...this.props.progress}
                link_create={link_create} />}
                children={progress_view} />
        }
        return <p>...</p>
    }
}

function mapStateToProps(state, props) {
    var model = getModelByCode(state, props.params.code);
    var init = false
    var progress = state.models.progress
    if (model && (_.isEmpty(progress) || progress.code != props.params.code)) {
        init = true
    }
    return {
        model,
        progress,
        init
    }
}

function mapDispatchToProps(dispatch) {
    const modelsActions = bindActionCreators(ModelsActions, dispatch);
    return {
        startProgress: modelsActions.startProgress,
        submitStep: modelsActions.submitStep,
        removeStep: modelsActions.submitStep
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateConteiner)
