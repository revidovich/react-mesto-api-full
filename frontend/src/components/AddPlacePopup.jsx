import React, { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddCard }) {

  const [form, setForm] = useState({name: '', link: ''});

  useEffect(() => {
  if (isOpen === true) {
    setForm({
    name: '',
    link: ''
    });
  }
  }, [isOpen])

  function handleChange(e) {
    const input = e.target;
    setForm({  // Обработчик изменения инпута обновляет стейт
      ...form,
      [input.name]: input.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddCard(form);
  }

  return (
    <PopupWithForm
      name='confirm'
      title='Новое место'
      buttonText='Создать'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className='popup__label'>
        <input className='popup__input popup__input_place-name'
          type='text'
          name='name'
          value={form.name} // Значение элемента «привязывается» к значению стейта
          onChange={handleChange}
          autoComplete='off'
          placeholder='Название'
          minLength='1'
          maxLength='30'
          required />
        <span className='popup__error' />
      </label>
      <label className='popup__label'>
        <input className='popup__input popup__input_image_url'
          type='url'
          inputMode='url'
          name='link'
          value={form.link}
          onChange={handleChange}
          placeholder='Ссылка на картинку'
          required />
        <span className='popup__error' />
      </label>

    </PopupWithForm>
  )
}

export default AddPlacePopup