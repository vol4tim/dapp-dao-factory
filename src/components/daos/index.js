import React, { PropTypes } from 'react'
import Item from './item'

const Daos = function(props) {
    return <div className="row">
        {props.items.map(function(item, index) {
            return <Item key={index} {...item} />
        })}
    </div>
}

Daos.propTypes = {
    items: PropTypes.array.isRequired
}

export default Daos
