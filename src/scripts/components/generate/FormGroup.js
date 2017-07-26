import React from 'react'
import { toCamelCase } from '../../lib/toCamelCase'

const generateFormGroup = (context, { label, placeholder }) => {
  const labelProperty = toCamelCase(label)

  return (
    <div className='form-group'>
      <label>{label}</label>
      <input className='form-control' ref={(_label) => context[label] = _label} placeholder={placeholder} />
    </div>
  )
}


export default generateFormGroup
