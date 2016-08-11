import React, { PropTypes } from 'react'
import Item from './item'

const Daos = function(props, context) {
    return <div className="row">
        {props.items.map(function(item, index) {
            return <Item key={index} {...item} update={()=>{
                props.update(item.code, item.version, item.address)
                context.router.push('/create/'+ item.code)
            }} />
        })}
    </div>
}

Daos.contextTypes = {
  router: PropTypes.object.isRequired
}

Daos.propTypes = {
    items: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired
}

export default Daos
