import React from 'react'
import { withRouter } from 'react-router-dom'
import { Route } from 'react-router-dom'

import Header from './Header'
import HomeView from './HomeView'
import SampleComponent from './SampleComponent'
import LoginView from './LoginView'
import SignupView from './SignupView/index'


class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.history.listen(location => this.handleHistoryListen(location))
  }

  handleHistoryListen(location = {}) {
    if (location.pathname !== this.props.location.pathname) {
      this.props.location.pathname = location.pathname || window.location.pathname
      this.forceUpdate()
    }
  }

  toggleTheme() {
    const newTheme = this.props.theme === 'light' ? 'dark' : 'light'
    this.props.dispatchThemeChange(newTheme)
  }

  render() {
    return (
      <div className='content-wrapper'>
        <Header />
        <div>
          <Route exact path='/' component={HomeView} />
          <Route path='/sample' component={SampleComponent} />
          <Route path='/login' component={LoginView} />
          <Route path='/signup' component={SignupView} />
        </div>
      </div>
    )
  }
}

export default App
