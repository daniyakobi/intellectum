import React, {useEffect, useState, useContext, useCallback} from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './../../Default/Accordion.css'

const ProgramItem = ({module}) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const courseId = useParams().id
  const moduleId = module._id
  const [lessons, setLessons] = useState([])
  const [expanded, setExpanded] = useState(false)

  const fetchLessons = useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/get-lessons', 'GET', null, { Authorization: `Bearer ${auth.token}`, moduleId: moduleId })
        setLessons(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  useEffect(() => {
    fetchLessons()
  }, [fetchLessons])

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    fetchLessons()
  };
    
  return(
    <Accordion className="accordion__item" expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography>{module.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
           <p>{module.description}</p>
           <div className="info__line"></div>
           <ul className="course__program-list">
              {
                lessons.map((item, index) => {
                  return (
                    <li key={index} className="flex-column">
                      <p className="course__lesson-name flex-row-left"><span style={{width: 20}}>{index + 1}.</span>{item.name}</p>
                      <p className="course__lesson-description text-14 flex-row-left"><span style={{width: 20}}></span>{item.description}</p>
                    </li>
                  )
                })
              }
           </ul>
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}

export default ProgramItem