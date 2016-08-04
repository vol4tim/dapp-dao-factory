var Promise = require('es6-promise').Promise;
var _ = require('lodash')
var axios = require('axios');

// if (typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
//     web3 = new Web3(web3.currentProvider);
// } else if (typeof Web3 !== 'undefined') {
//     web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// } else if(typeof web3 == 'undefined' && typeof Web3 == 'undefined') {
//     throw new Error('Err web3');
// }

// var web3js = null;
// if () {
//
// }
export function getWeb3() {
    if (typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else if (typeof Web3 !== 'undefined') {
        web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    } else if(typeof web3 == 'undefined' && typeof Web3 == 'undefined') {
        return false
    }
    return web3
}

export function getUrlAbi(contract) {
    contract = contract.split(' ')
    contract = contract.pop()
    if (/builder/i.test(contract)) {
        return 'https://raw.githubusercontent.com/airalab/core/master/abi/builder/'+ contract +'.json'
    } else {
        return 'https://raw.githubusercontent.com/airalab/core/master/abi/modules/'+ contract +'.json'
    }
}

export function createModule(args, builder) {
    args = _.values(args);
    return new Promise(function(resolve, reject) {
        args = args.concat([
            {
                from: web3.eth.accounts[0],
                gas:  3000000,
                value: builder.buildingCostWei()
            }
        ]);

        var e = builder.Builded({}, '', function(error, result){
            if (error) {
                reject(e);
            }
            resolve(result.args.instance);
        })

        builder.create.apply(builder, args);
    });
}

export function linkCore(core, module, address) {
    return new Promise(function(resolve) {
        core.setModule(module, address, 'abi', true, {from:web3.eth.accounts[0], gas:300000})
        resolve(address);
    });
}

function loadAbi(url) {
    return axios.get(url);
}

export function loadAbiByName(name) {
    return loadAbi(getUrlAbi(name));
}

export function loadAbis(abis) {
    var req = _.map(abis, function(item){
        return loadAbiByName(item)
    })
    return axios.all(req)
}

export function getContract(abi, address) {
    return web3.eth.contract(abi).at(address)
}
