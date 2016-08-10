var Promise = require('es6-promise').Promise;
var _ = require('lodash')
var axios = require('axios');

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

export function removeModule(dao, name) {
    return new Promise(function(resolve) {
        var args = [
			name,
            {
                from: web3.eth.accounts[0],
                gas:  3000000
            }
        ];
        var tx = dao.removeModule.apply(dao, args);
		blockchain.subscribeTx(tx).
			then(()=>{
				resolve();
			}).
			catch(function(e) {
				console.log(e);
			});
    });
}

export function linkCore(core, module, address) {
    return new Promise(function(resolve) {
        var tx = core.setModule(module, address, 'abi', true, {from:web3.eth.accounts[0], gas:300000})
        blockchain.subscribeTx(tx).
			then(()=>{
				resolve(address);
			}).
			catch(function(e) {
				console.log(e);
			});
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

export class Blockchain {
	subscribes = []
	web3 = false
    constructor(web3) {
		this.web3 = web3
		if (this.web3) {
			this.observeLatestBlocks()
		}
    }
	observeLatestBlocks() {
		var self = this
		this.web3.eth.filter('latest').watch(function(e, hash){
			if (!e) {
				var info = self.web3.eth.getBlock(hash);
				_.forEach(self.subscribes, function(item) {
					if (_.isFunction(item)) {
						item(hash)
					} else {
						if (_.findIndex(info.transactions, (i)=>i==item.tx) >= 0) {
							var transaction = self.web3.eth.getTransaction(item.tx)
							if (transaction) {
								item.cb(transaction)
								_.remove(self.subscribes, function(f) {
									return !_.isFunction(f) && f.tx == item.tx;
								});
							}
						}
					}
				})
			}
		});
	}
    setSubscribe(cb) {
        this.subscribes.push(cb)
    }
	observeBlock() {
		var self = this
		return new Promise(function(resolve) {
			self.setSubscribe(function() {
				resolve()
			});
		});
	}
	subscribeTx(tx) {
		var self = this
		return new Promise(function(resolve) {
			self.setSubscribe({
				tx: tx,
				cb: function(tx) {
					resolve(tx)
				}
			});
		});
	}
}

export const blockchain = new Blockchain(getWeb3())

// blockchain.subscribeTx('0x111111').
// 	then((tx)=>{
// 		console.log('tx', tx);
// 	}).
// 	catch(function(e) {
// 		console.log(e);
// 	});
//
// blockchain.setSubscribe(()=>{
// 	console.log('update 1');
// })
//
// blockchain.setSubscribe(()=>{
// 	console.log('update 2');
// })
