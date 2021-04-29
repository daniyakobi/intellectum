import React from 'react'
import './Input.css'

export default (props) => {
  return(
    <input 
      type={ props.type } 
      name={ props.name } 
      id={ props.id } 
      className={ 'input ' + props.class } 
      placeholder={ props.placeholder }
      onChange={ props.handler }
      value={ props.value }
      accept={ props.accept }
    />
  )
}
