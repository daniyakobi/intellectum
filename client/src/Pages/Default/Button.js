import React from 'react'
import './Buttons.css'
const Button = (props) => {
  return (
    <button className={ 'button flex-center ' + props.class } onClick={ props.handler } type={ props.type } >
      { props.name }
    </button>
  )
}

export default Button
