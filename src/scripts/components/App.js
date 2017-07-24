import React from 'react'
import { withRouter } from 'react-router-dom'
import { Route, Link } from 'react-router-dom'

import Home from './Home'
import SampleComponent from './SampleComponent'


class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.history.listen(location => this.handleHistoryListen(location))
  }

  handleHistoryListen( location = {} ) {
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
      <div id='main' className={this.props.theme}>
        <h1>hi</h1>
        <nav>
          <Link to='/'>Home</Link>
          <Link to='/sample'>Dashboard</Link>
        </nav>
        <div>You are now at {this.props.location.pathname}</div>
        <div>
          <Route exact path='/' component={Home} />
          <Route path='/sample' component={SampleComponent} />
        </div>
      </div>
    )
  }
}

export default App
