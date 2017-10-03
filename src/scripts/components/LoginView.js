import React from 'react'
import { Link } from 'react-router-dom'
import { login, resetPassword, signInWithFacebook } from '../db/auth'
import { getUser } from '../db/user'

class LoginView extends React.Component {
  constructor ( props ) {
    super( props )

    this.handleSubmit = this.handleSubmit.bind( this )

    this.state = {
      errorMsg: null,
    }
  }

  handleSubmit( e ) {
    e.preventDefault()

    login( this.email.value, this.pw.value )
    .then(( data ) => this.handleLogin( data.uid ))
    .catch(( error ) => this.setErrorMsg( 'Invalid username/password.', error ))
  }

  resetPassword () {
    resetPassword( this.email.value )
    .then(() => this.setErrorMsg( `Password reset email sent to ${ this.email.value }.` ))
    .catch(( error ) => this.setErrorMsg( 'Email address not found.', error ))
  }

  setErrorMsg ( msg ) {
    this.setState({
      errorMsg: msg,
    })
  }

  handleLogin( uid ) {
    getUser( uid ).then(( snapshot ) => {
      const user = snapshot.val()
      this.props.updateCurrentUser( user )
      this.props.history.push( '/map' )
    })
  }

  renderErrorMsg() {
    if ( !this.state.errorMsg ) return null

    return (
      <div className='error-msg small'>
        {this.state.errorMsg}
      </div>
    )
  }

  render () {
    return (
      <main id='login-view' className='view'>
        <div className='content-wrapper'>
          <div className='illustration'></div>
          <h1> Login </h1>
          <form onSubmit={this.handleSubmit}>
            <input
              type='email'
              className='login-input email'
              ref={( $e ) => this.email = $e}
              placeholder='Email'
            />
            <div className='input-wrapper'>
              <input
                type='password'
                className='login-input password'
                ref={( $p ) => this.pw = $p}
                placeholder='Password'
              />
              <div className='forgot-password small'>
                Forgot?
              </div>
            </div>
            {this.renderErrorMsg()}
            <button type='submit' className='submit'>
              Log In
            </button>
          </form>

          <hr />

          <button className='button facebook-login full-width' onClick={signInWithFacebook}>
            or continue with Facebook
          </button>

          <div className='sign-up-instruction small'>
            Don't have an account? <Link to='/signup'>Sign Up</Link>
          </div>
        </div>
      </main>
    )
  }
}

export default LoginView
