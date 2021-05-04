import React, {useState} from 'react'
import $ from 'jquery'
import arrow from '../../img/sidebar/src/arrow-down.svg'
import './Select.css'

const Select = (props) => {
  const [value, setValue] = useState({ value: '' })

  var select = ''

  const handleSelect = (event) => {
    select = event.target.dataset.value
    setValue({value: select})
  }

  const showSelect = (event) => {
    const selectParent = event.target.parentElement.parentElement
    const selectValue = document.querySelector('.select__head span')
    selectParent.classList.toggle('open')
  }

  return (
    <>
      <div className={`select form__select ${props.classes}`} onClick={ showSelect }>
        <input className='select__input' type="hidden" name={`${props.name}[]`} id={ props.id } defaultValue={value.value ? value.value : props.current} />
        <div className="select__head text-18 flex-row"><span style={{width: '100%'}}>{ value.value ? value.value : props.current }</span><img className="select__arrow" src={ arrow } alt="Открыть" /></div>
        <ul className="select__list">
          { props.options.map((item, index) => {
            return ( <li className="select__item text-18" data-value={ item.name } key={ index } onClick={ handleSelect } >{ item.name }</li> )
          }) }
        </ul>
      </div>
    </>
  )
}

export default Select