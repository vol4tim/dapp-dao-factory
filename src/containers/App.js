import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ModelsActions from '../actions/ModelsActions'

import Header from '../components/header'
import Footer from '../components/footer'

import './style.css'

class App extends Component {
    componentDidMount() {
        this.props.load()
    }

    render() {
        return <div>
            <Header title={this.props.title} />
            <div className="container">
                {this.props.children}
            </div>
            <Footer />
        </div>
    }
}

function mapStateToProps(state) {
    return {
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
