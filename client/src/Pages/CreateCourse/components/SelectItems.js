import React from 'react'

const SelectItems = ({ directions }) => {
  if(!directions.length) {
    return(
      <option value=''>Направлений нет</option>
    )
  }

  return(
    <>
      {
        directions.map((item, index) => {
          return(
            <option key={ index } value={ item.name }>{ item.name }</option>
          )
        })
      }
    </>
  )
}

export default SelectItems