import {startSubmit, stopSubmit, reset} from 'redux-form';
import _ from 'lodash'
import axios from 'axios'
import { LOAD, CREATE, UPDATE, LOAD_DATA, UPDATE_PROGRESS } from '../constants/Models'
import { loadAbis, loadAbiByName, getContract, createModule as web3CreateModule, removeModule as web3RemoveModule, linkCore } from '../utils/dao_factory'
import { loader as appLoader } from './AppActions'
import { add as daoAdd, update as daoUpdate } from './DaosActions'

export function load() {
    return dispatch => {
        dispatch(appLoader(true))
        axios.get('dapps.json').
            then((result)=>{
                dispatch({
                    type: LOAD,
                    payload: result.data
                })
                dispatch(appLoader(false))
            }).
            catch(function(e) {
                console.log('LOAD ERR',e);
            });
    }
}

export function create(code, force = true) {
    return {
        type: CREATE,
        payload: {
            code,
            force
        }
    }
}

export function update(code, version, address) {
    return {
        type: UPDATE,
        payload: {
            code,
            version,
            address
        }
    }
}

export function loadData(progress) {
    return dispatch => {
        var progress_data = {...progress};

        var abi_names = _.map(progress_data.modules, 'module_factory');
        abi_names = _.uniq(abi_names);
        abi_names = _.compact(abi_names);
        if (!_.isEmpty(progress_data.core)) {
            abi_names.unshift(progress_data.core.module_factory);
        }
        abi_names.unshift('Core');

        loadAbis(abi_names).
            then((results)=>{
                var abis = _.reduce(abi_names, function(result, value, index) {
                    return _.set(result, value, results[index].data);
                }, {});

                var abi, func;
                // подготавливаем данные для формы для создания core
                if (!_.isEmpty(progress_data.core)) {
                    abi = abis[progress_data.core.module_factory]
                    func = _.find(abi, {name: 'create'});
                    var fields = (func) ? _.map(func.inputs, 'name') : []
                    var labels = {}
                    if (_.has(progress_data.core, 'params')) {
                        labels = progress_data.core.params
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
                    progress_data.core = {
                        ...progress_data.core,
                        abi: abi,
                        fields: fields,
                        params: params,
                        data: data
                    };
                }

                // подготавливаем данные для формы для для каждого из требуемого модуля
                progress_data.modules = _.map(progress_data.modules, function(module) {
                    abi = abis[module.module_factory]
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
                    // данные для инициализации формы (начальные данные в полях)
                    var data = _.reduce(fields, function(result, value) {
                        return _.set(result, value, '');
                    }, {});

                    if (!_.has(module, 'action')) {
                        module.action = 'add';
                    }
                    if (module.action == 'update') {
                        module.address = ''
                    }

                    return {
                        ...module,
                        abi: abi,
                        fields: fields,
                        params: params,
                        data: data
                    }
                });

                // привязываем готовые модули
                progress_data.modules = _.map(progress_data.modules, function(item) {
                    _.each(item.params_link, function(index, param) {
                        item.data[param] = progress_data.modules[index].address
                    })
                    return item
                })

                dispatch({
                    type: LOAD_DATA,
                    payload: progress_data
                })
            }).
            catch(function(e) {
                console.log('LOAD_DATA_DAO ERR', e);
            });
    }
}

function getUpdates(updates, version) {
    var skip = true;
    return _.reduce(updates, function(result, value) {
        if (version == value.version) {
            skip = false
        }
        if (skip == true) {
            return [];
        }
        _.map(value.modules, function(item) {
            var index = _.findIndex(result, {name: item.name})
            // если модуля нет в результате
            if (index == -1) {
                //то добавляем его как есть
                result.push(item);
            } else { //иначе
                if (item.action == 'remove') { //если модуль нужно удалить
                    if (result[index].action == 'add') {
                        // нужно такой модуль удалить из результата
                        result = _.filter(result, function(item, i) {
                            if (index != i) {
                                return true
                            }
                        })
                    } else {
                        //обновляем модуль в результате на удаление
                        result[index].action = 'remove'
                    }
                } else if (item.action == 'add') { //если модуль нужно добавить
                    //если модуль был на удаление
                    if (result[index].action == 'remove') {
                        //то действие обновляем на обновить
                        result[index].action = 'update'
                    } else {
                        //result.push(item); нужно добавить но не понятно что делать с одинаковыми именами
                    }
                } else if (item.action == 'update') { //если модуль нужно обновить
                    //если модуль был на удаление
                    if (result[index].action == 'remove') {
                        //то действие обновляем на обновить
                        result[index].action = 'update'
                    }
                }
            }
        })
        return result;
    }, []);
}

export function loadDataUpdate(progress) {
    return dispatch => {
        var progress_new = {...progress};
        var updates = getUpdates(progress_new.updates, progress_new.current_version)
        var core_abi;
        loadAbiByName('Core').
            then((abi)=>{
                core_abi = abi.data;
                var dao = getContract(core_abi, progress_new.core.address);

                // привязываем к модулям адреса
                progress_new.modules = _.map(progress_new.modules, function(item) {
                    var address = dao.getModule(item.name)
                    if (address=='0x0000000000000000000000000000000000000000') {
                        address = ''
                    }
                    return {
                        ...item,
                        address
                    }
                })

                _.forEach(updates, function(item){
                    const i = _.findIndex(progress_new.modules, {name: item.name})
                    if (item.action == 'add' && i == -1) {
                        item.address = ''
                        progress_new.modules.push(item)
                    } else if (item.action == 'update') {
                        progress_new.modules[i].action = 'update'
                        progress_new.modules[i].address = ''
                    } else if (item.action == 'remove') {
                        item.address = ''
                        progress_new.modules.push(item)
                    }
                })

                dispatch(loadData(progress_new))
            }).
            catch(function(e) {
                console.log('LOAD CORE ABI', e);
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

export function createModule(factory_address, progress, module_index, last, params) {
    return dispatch => {
        var module;
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
                var builder = getContract(module.abi, factory.getModule(module.module_factory));
                return web3CreateModule(params, builder)
            }).
            then((new_module_address)=>{
                if (module_index != -1) {
                    var core = getContract(core_abi, progress.core.address);
                    return linkCore(core, module.name, new_module_address)
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
                    if (progress.action == 'update') {
                        dispatch(daoUpdate(dao_address, progress.version))
                    } else {
                        dispatch(daoAdd(progress.code, dao.name(), dao_address, progress.version))
                    }
                }
            }).
            catch(function(e) {
                console.log('SUBMIT ERR', e);
                dispatch(stopSubmit('ModuleForm', {error: e}));
            });
    }
}

export function removeModule(factory_address, progress, module_index, last) {
    return dispatch => {
        var module = progress.modules[module_index]

        if (!_.isObject(module)) {
            console.log('SUBMIT ERR NOT FIND MODULE');
            return;
        }

        dispatch(startSubmit('ModuleForm'));

        var core_abi;
        loadAbiByName('Core').
            then((abi)=>{
                core_abi = abi.data;
                var dao = getContract(core_abi, progress.core.address);
                return web3RemoveModule(dao, module.name)
            }).
            then(()=>{
                dispatch(stopSubmit('ModuleForm'));
                dispatch(updateProgress(module_index, '-', last));
                dispatch(reset('ModuleForm'));

                // если готов core и нет модулей или готов последний модуль
                if (last) {
                    var dao = getContract(core_abi, progress.core.address);
                    if (progress.action == 'update') {
                        dispatch(daoUpdate(progress.core.address, progress.version))
                    } else {
                        dispatch(daoAdd(progress.code, dao.name(), progress.core.address, progress.version))
                    }
                }
            }).
            catch(function(e) {
                console.log('SUBMIT ERR', e);
                dispatch(stopSubmit('ModuleForm', {error: e}));
            });
    }
}
