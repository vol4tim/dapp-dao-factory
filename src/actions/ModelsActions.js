import {startSubmit, stopSubmit, reset} from 'redux-form';
import _ from 'lodash'
import axios from 'axios'
import { LOAD, START_PROGRESS, UPDATE_PROGRESS } from '../constants/Models'
import { loadAbis, loadAbiByName, getContract, createModule, linkCore } from '../utils/dao_factory'
import { add as daoAdd } from './DaosActions'

export function load() {
    return dispatch => {
        axios.get('dapps.json').
            then((result)=>{
                dispatch({
                    type: LOAD,
                    payload: result.data
                })
            }).
            catch(function(e) {
                console.log('LOAD ERR',e);
            });
    }
}

export function startProgress(model) {
    return dispatch => {
        var abi_names = _.map(model.modules, 'name');
        abi_names = _.uniq(abi_names);
        abi_names = _.compact(abi_names);
        if (!_.isEmpty(model.core)) {
            abi_names.unshift(model.core.name);
        }
        abi_names.unshift('Core');

        loadAbis(abi_names).
            then((results)=>{
                var abis = _.reduce(abi_names, function(result, value, index) {
                    return _.set(result, value, results[index].data);
                }, {});

                var abi, func;

                // подготавливаем данные для формы для создания core
                if (!_.isEmpty(model.core)) {
                    abi = abis[model.core.name]
                    func = _.find(abi, {name: 'create'});
                    var fields = (func) ? _.map(func.inputs, 'name') : []
                    var labels = {}
                    if (_.has(model.core, 'params')) {
                        labels = model.core.params
                    }
                    var params = (func) ? _.map(func.inputs, function(item) {
                        var label = item.name
                        if (_.has(labels, item.name)) {
                            label = labels[item.name]
                        }
                        return label + ' ('+ item.type +')'
                    }) : []
                    // данные для инициализации формы (начальные данные в полях)
                    var data = _.reduce(fields, function(result, value) {
                        return _.set(result, value, '');
                    }, {});
                    model.core = {
                        ...model.core,
                        abi: abi,
                        fields: fields,
                        params: params,
                        data: data
                    };
                }

                // подготавливаем данные для формы для для каждого из требуемого модуля
                model.modules = _.map(model.modules, function(module) {
                    abi = abis[module.name]
                    func = _.find(abi, {name: 'create'});
                    var fields = (func) ? _.map(func.inputs, 'name') : []
                    var labels = module.params;
                    var params = (func) ? _.map(func.inputs, function(item) {
                        var label = item.name
                        if (_.has(labels, item.name)) {
                            label = labels[item.name]
                        }
                        return label + ' ('+ item.type +')'
                    }) : []
                    // будим запрашивать для каждого модуля название с которым он будет сохранятся в core
                    fields.unshift('name_module_core');
                    params.unshift('Название модуля');
                    // данные для инициализации формы (начальные данные в полях)
                    var data = _.reduce(fields, function(result, value) {
                        return _.set(result, value, '');
                    }, {});
                    return {
                        ...module,
                        abi: abi,
                        fields: fields,
                        params: params,
                        data: data
                    }
                });

                // привязываем готовые модули
                model.modules = _.map(model.modules, function(item) {
                    _.each(item.params_link, function(index, param) {
                        item.data[param] = model.modules[index].address
                    })
                    return item
                })

                dispatch({
                    type: START_PROGRESS,
                    payload: {
                        status: 0,
                        ...model
                    }
                })
            }).
            catch(function(e) {
                console.log('START_PROGRESS ERR', e);
            });
    }
}

export function updateProgress(module_index, address, last) {
    return {
        type: UPDATE_PROGRESS,
        payload: {
            module_index,
            address,
            last
        }
    }
}

export function submitStep(factory_address, progress, module_index, last, params) {
    return dispatch => {

        var user_name_module = false;
        if (_.has(params, 'name_module_core')) {
            user_name_module = params.name_module_core; // для core.setModule (linkCore)
            params = _.omit(params, ['name_module_core']);
        }
        if (!_.isEmpty(progress.core) && module_index == -1) {
            module = progress.core
        } else {
            module = progress.modules[module_index]
        }
        if (!_.isObject(module)) {
            console.log('SUBMIT ERR NOT FIND MODULE');
            return;
        }

        dispatch(startSubmit('ModuleForm'));

        var core_abi;
        loadAbiByName('Core').
            then((abi)=>{
                core_abi = abi.data;
                var factory = getContract(core_abi, factory_address);
                var builder = getContract(module.abi, factory/*.getModule(module.name)*/);
                return createModule(params, builder)
            }).
            then((new_module_address)=>{
                if (user_name_module) {
                    var core = getContract(core_abi, progress.core.address);
                    return linkCore(core, user_name_module, new_module_address)
                }
                return new_module_address;
            }).
            then((new_module_address)=>{
                dispatch(stopSubmit('ModuleForm'));
                dispatch(updateProgress(module_index, new_module_address, last));
                dispatch(reset('ModuleForm'));

                // если готов core и нет модулей или готов последний модуль
                if (last) {
                    var dao_address;
                    if (progress.core.address!='') {
                        dao_address = progress.core.address
                    } else {
                        dao_address = new_module_address
                    }
                    var dao = getContract(core_abi, dao_address);
                    dispatch(daoAdd(progress.code, dao.name(), dao_address, progress.version))
                }
            }).
            catch(function(e) {
                console.log('SUBMIT ERR', e);
                dispatch(stopSubmit('ModuleForm', {error: e}));
            });
    }
}
