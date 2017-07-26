import React from 'react'
import { Link } from 'react-router-dom'

class HomeView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <main id='home-view'>
        <h1>Whatever</h1>

        <button className='button full-width'>Sign Up With Facebook</button>

        <Link to='/signup'>
          <button className='button full-width knockout'>Sign Up With Email</button>
        </Link>
      </main>
    )
  }
}

export default HomeView
