import React from 'react'
import { login, resetPassword } from '../db/auth'
import { getUser } from '../db/user'

class LoginView extends React.Component {
  constructor ( props ) {
    super( props )

    this.handleSubmit = this.handleSubmit.bind( this )

    this.state = {
      loginMessage: '',
    }
  }

  handleSubmit( e ) {
    e.preventDefault()

    login( this.email.value, this.pw.value )
    .then(( data ) => {
      getUser( data.uid ).then(( snapshot ) => {
        const user = snapshot.val()
        this.props.updateCurrentUser( user )
        this.props.history.push( '/map' )
      })
    })
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

  render () {
    console.log( 'render' )
    return (
      <main id='login-view' className='view'>
        <h1> Login </h1>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>Email</label>
            <input className='form-control' ref={( email ) => this.email = email} placeholder='Email'/>
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input type='password' className='form-control' placeholder='Password' ref={( pw ) => this.pw = pw} />
          </div>
          {
            this.state.loginMessage &&
             <div className='alert alert-danger' role='alert'>
               <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>
               <span className='sr-only'>Error:</span>
               &nbsp;{this.state.loginMessage} <a href='#' onClick={this.resetPassword} className='alert-link'>Forgot Password?</a>
             </div>
          }
          <button type='submit' className='btn btn-primary'>Login</button>
          {
            this.state.errorMsg &&
           <div className='error'>
             {this.state.errorMsg}
           </div>
          }
        </form>
      </main>
    )
  }
}

export default LoginView
