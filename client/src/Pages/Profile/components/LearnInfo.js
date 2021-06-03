import React, {useEffect, useState, useContext, useCallback, useReducer} from 'react'
import { NavLink, useParams, useHistory  } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'

const LearnItem = ({ lesson }) => {
  return (
    <div className="lesson__block-info flex-column">
      <h2 class="text-24">{ lesson.name }</h2>
      <p>{ lesson.description }</p>
    </div>
  )
}

export default LearnItem