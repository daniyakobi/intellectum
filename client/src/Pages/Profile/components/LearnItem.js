import React, {useEffect, useState, useContext, useCallback, useReducer} from 'react'
import { NavLink, useParams, useHistory  } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import { Player, ControlBar, ReplayControl, ForwardControl, CurrentTimeDisplay, TimeDivider, PlaybackRateMenuButton, VolumeMenuButton } from 'video-react';
import "../../../../node_modules/video-react/dist/video-react.css";

const LearnItem = ({ video }) => {
  return (
    <div className="lesson__block-wrapper flex-column">
      <div className="lesson__block-video">
        <Player width={'100%'} height={'100%'}>
          <source src={ `http://localhost:3000${video}` } />
          <ControlBar>
            <ReplayControl seconds={10} order={1.1} />
            <ForwardControl seconds={10} order={1.2} />
            <CurrentTimeDisplay order={4.1} />
            <TimeDivider order={4.2} />
            <PlaybackRateMenuButton rates={[2, 1, 0.5]} order={7.1} />
            <VolumeMenuButton vertical />
          </ControlBar>
        </Player>
      </div>
    </div>
  )
}

export default LearnItem