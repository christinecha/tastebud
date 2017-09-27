import React from 'react'

class Instructions extends React.Component {
  render() {
    const vocab = {
      0: { noun: 'a place', pronoun: 'it'},
      1: { noun: 'a friend', pronoun: 'them'}
    }

    const { noun, pronoun } = vocab[this.props.searchType]

    return (
      <div className='instructions'>
        <p>To add {noun}, just search <br /> for {pronoun} by name.</p>
      </div>
    )
  }
}

export default Instructions
