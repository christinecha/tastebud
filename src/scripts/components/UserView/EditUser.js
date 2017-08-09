import React from 'react'
import userSchema from '../../schema/userSchema'
import { saveUser } from '../../db/user'

class EditUser extends React.Component {
  constructor(props) {
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this)

    this.state = Object.assign({}, userSchema, this.props.currentUser)
  }

  handleInputChange(e) {
    const newState = {}
    newState[e.target.name] = e.target.value
    this.setState(newState)
  }

  handleSubmit() {
    this.props.updateCurrentUser(this.state)
    saveUser(this.state).then(() => {
    })
  }

  render() {
    const { fullName, username } = this.state
    return (
      <div>
        <input name='fullName' type='text' value={fullName} onChange={this.handleInputChange}/>
        <input name='username' type='text' value={username} onChange={this.handleInputChange}/>
        <button onClick={() => this.handleSubmit()}>Submit Changes</button>
      </div>
    )
  }
}

export default EditUser
