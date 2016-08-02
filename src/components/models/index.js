import React, { PropTypes, Component } from 'react'
import Item from './item'

export default class Models extends Component {
    render() {
        const { items } = this.props

        return <div className="row">
            {items.map(function(item) {
                return <Item key={item.code} {...item} />
            })}
        </div>
    }
}

Models.propTypes = {
    items: PropTypes.array.isRequired
}
