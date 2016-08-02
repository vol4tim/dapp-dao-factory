import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'

import Header from '../components/header'
import Footer from '../components/footer'

import './style.css'

class App extends Component {
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
    return {
        AppActions: bindActionCreators(AppActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
