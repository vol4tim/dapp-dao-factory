import React, { PropTypes } from 'react'
import Item from './item'

const Models = function(props) {
    return <div className="row">
        {props.items.map(function(item) {
            return <Item key={item.code} {...item} />
        })}
    </div>
}

Models.propTypes = {
    items: PropTypes.array.isRequired
}

export default Models
