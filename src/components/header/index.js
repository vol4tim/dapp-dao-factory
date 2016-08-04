import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import style from './style.css'

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    handleToggle = () => this.setState({open: !this.state.open});

    render() {
        return <nav className={style.main +' navbar navbar-inverse navbar-static-top'}>
            <div className="container">
                <div className="navbar-header">
                    <button
                        type="button"
                        className="navbar-toggle collapsed"
                        onClick={this.handleToggle}
                    >
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="#">{this.props.title}</a>
                </div>
                <div className={'collapse navbar-collapse '+ ((this.state.open) ? style.menu_open : style.menu_hide)}>
                    <ul className="nav navbar-nav navbar-right">
                        <li><Link to={'/daos'} activeClassName={style.active}>Мои DAO</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    }
}
Header.propTypes = {
    title: PropTypes.string.isRequired
}
