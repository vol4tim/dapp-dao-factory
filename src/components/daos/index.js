import React, { PropTypes, Component } from 'react'
import Item from './item'

export default class Daos extends Component {
    render() {
        const { items } = this.props

        return <div className="row">
            {items.map(function(item, index) {
                return <Item key={index} {...item} />
            })}
        </div>
    }
}

Daos.propTypes = {
    items: PropTypes.array.isRequired
}
