import React, { useState, useRef, useEffect } from 'react'

export const EditName = ({profil}) => {
    const [name, setName] = useState(`${profil.first_name} ${profil.last_name}`)
    const [nameInputValue, setNameInputValue] = useState(`${profil.first_name} ${profil.last_name}`)
    const [editable, setEditable] = useState(false)
    const nameInput = useRef(null)

    const toggleEditable = () => {
        setEditable(!editable)
    }

    const saveName = () => {
        const nameParts = nameInputValue.split(' ')
        const first = nameParts[0]
        const last = nameParts[nameParts.length - 1]

        if(nameInputValue === '') {
            console.log('Fuck you')
            return
        }

        if(nameParts.length < 2) {
            console.log('fuck you again')
            return
        } 

        if(first === '' || last === '') {
            console.log('fuck you again')
            return
        }

        const currentName = `${first} ${last}`
        setName(currentName)
        toggleEditable()
    }

    useEffect(() => {
        if(editable) {
            nameInput.current.focus()
            nameInput.current.select()
        }
    }, [editable])

    useEffect(() => {
        if(name !== `${profil.first_name} ${profil.last_name}`) {
            console.log(name)
        }
        
    }, [name])

    return (
        <div className='EditName'>
            <h3 className={editable ? 'name hidden': 'name'}>{name}</h3>
            <input onBlur={saveName} onChange={e => setNameInputValue(e.target.value)} ref={nameInput} className={editable ? 'name-input': 'name-input hidden'} type='text' value={nameInputValue} placeholder='Full name' />
            <button onClick={toggleEditable} className={editable? 'edit-btn hidden': 'edit-btn'}><i className="fas fa-pen"></i></button>
        </div>
    )
}