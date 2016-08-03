import React from 'react'
import { Route, IndexRoute } from 'react-router'
import _ from 'lodash'

import App from './containers/App'
import { setTitle } from './actions/AppActions'
import NotFound from './components/NotFound'
import Models from './containers/models'
import ModelView from './containers/models/view'
import ModelCreate from './containers/models/create'
import Daos from './containers/daos'

export const routes = (store) => {

    const setTitleApp = (prevState, nextState) => {
        var last = _.last(nextState.routes);
        store.dispatch(setTitle(last.title))
    }

    return (
        <div>
            <Route path='/' component={App} onChange={setTitleApp}>
                <IndexRoute component={Models} title='Dapp DAO factory' />
                <Route path='view/:code' component={ModelView} title='Dapp DAO factory' />
                <Route path='create/:code' component={ModelCreate} title='Dapp DAO factory' />
                <Route path='daos' component={Daos} title='Dapp DAO factory' />
            </Route>
            <Route path='*' component={NotFound} />
        </div>
    )
}
