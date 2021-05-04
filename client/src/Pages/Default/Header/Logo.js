import React from 'react'
import {NavLink} from 'react-router-dom'

export default (props) => {
  return ( 
    <NavLink to="/profile/main-info" className={ props.class }></NavLink>
  )
}
