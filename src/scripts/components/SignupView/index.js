import React from 'react'
import { signUpWithEmail, login, resetPassword } from '../../db/auth'
import { saveUser } from '../../db/user'
import userSchema from '../../schema/userSchema'
import generateFormGroup from '../generate/FormGroup'
import * as constants from './constants'
import * as hasError from './hasError'


class SignupView extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    this.state = {
      step: 0,
      fullName: '',
      email: '',
      username: '',
      password: '',
      isValidated: false,
      loginMessage: ''
    }
  }

  handleClick() {
    if (!this.state.isValidated) return

    const step = constants.STEPS[this.state.step]

    const newState = {}
    newState[step] = this.$input.value


    newState.step = this.state.step + 1
    newState.isValidated = false

    this.$input.value = ''
    this.setState(newState, () => {

      // This was the last step of the form!
      if (this.state.step === Object.keys(constants.STEPS).length) {
        this.submitForm()
      }
    })
  }

  getValidated(value) {
    const step = constants.STEPS[this.state.step]

    hasError[step](value).then(error => {
      this.setState({ isValidated: !error })
    })
  }

  submitForm() {
    const { fullName, email, username, password } = this.state

    signUpWithEmail(email, password)
    .then((response) => {
      const _userData = {
        uid: response.uid,
        fullName,
        email,
        username,
        dateJoined: performance.now()
      }

      const userData = Object.assign({}, userSchema, _userData)

      saveUser(userData)
    })
    .catch((error) => {
      console.log(error)
      this.setState(setErrorMsg('Invalid username/password.'))
    })
  }

  handleInputChange(e) {
    const step = constants.STEPS[this.state.step]

    this.getValidated(e.target.value)
    console.log(step, e.target.value)
  }

  renderInput() {
    const step = constants.STEPS[this.state.step]
    const type = constants.INPUT_TYPES[step]
    const label = constants.LABELS[step]
    const placeholder = constants.PLACEHOLDERS[step]

    return (
      <div>
        <label>{label}</label>
        <div className='input-wrapper'>
          <input
            className='full-width'
            ref={$input => this.$input = $input}
            type={type}
            placeholder={placeholder}
            onChange={this.handleInputChange}
          />
          {!this.state.isValidated && <div className='icon x'>✖️</div>}
          {this.state.isValidated && <div className='icon check'>✔️</div>}
        </div>
      </div>
    )
  }

  render() {
    const buttonClassName = `button full-width ${!this.state.isValidated && 'inactive'}`

    return (
      <main id='signup-view'>
        <h1>Create an Account</h1>
        <section className='signup-form'>
          {this.renderInput()}
          <br />
          <button className={buttonClassName} onClick={this.handleClick}>Next ></button>
        </section>
      </main>
    )
  }
}

export default SignupView
