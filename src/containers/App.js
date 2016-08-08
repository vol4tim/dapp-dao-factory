import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getWeb3 } from '../utils/dao_factory'
import * as ModelsActions from '../actions/ModelsActions'

import Header from '../components/header'
import Footer from '../components/footer'

import './style.css'

class App extends Component {
    componentWillMount() {
        if (getWeb3()) {
            this.props.load()
        }
    }

    render() {
        return <div>
            <Header title={this.props.title} />
            <div className="container">
                {getWeb3() ?
                    (!this.props.loader) ? this.props.children : <p className="text-center">Загрузка...</p>
                    :
                    <p>нужен mist</p>
                }
            </div>
            <Footer />
        </div>
    }
}

function mapStateToProps(state) {
    return {
        loader: state.app.loader,
        title: state.app.title
    }
}

function mapDispatchToProps(dispatch) {
    const modelsActions = bindActionCreators(ModelsActions, dispatch);
    return {
        load: modelsActions.load
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
