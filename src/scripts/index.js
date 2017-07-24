import '../styles/index.less'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory, Route, withRouter } from 'react-router-dom'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { combineReducers, createStore } from 'redux'
import { createBrowserHistory } from 'history'
import { updateLocation } from './actions'

import reducers from './reducers'
import AppContainer from './components/AppContainer'

const $app = document.getElementById('app')

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)


const history = syncHistoryWithStore(createBrowserHistory(), store)

const AppContainerWithRouter = withRouter(AppContainer)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <AppContainerWithRouter />
    </Router>
  </Provider>,
  $app
)
