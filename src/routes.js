import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from './containers/App'
import NotFound from './components/NotFound'
import Models from './containers/models'
import ModelView from './containers/models/view'
import ModelCreate from './containers/models/create'
import Daos from './containers/daos'

export const routes = () => {
    return (
        <div>
            <Route path='/' component={App}>
                <IndexRoute component={Models} />
                <Route path='view/:code' component={ModelView} />
                <Route path='create/:code' component={ModelCreate} />
                <Route path='daos' component={Daos} />
            </Route>
            <Route path='*' component={NotFound} />
        </div>
    )
}
