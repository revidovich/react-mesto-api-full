import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function Card({
  card,
  onCardClick,
  onCardDelete,
  onCardLike
}) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id;
  const cardDeleteButtonClassName = (`card__recycle-bin hover-style ${isOwn ? '' : 'card__recycle-bin_hidden'}`);
  const isLiked = card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = `card__like hover-style ${isLiked && 'card__like_active'}`;

  function handleClick() {
    onCardClick(card);
  }

  function handleDeleteClick () {
    onCardDelete(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  return (
    <li className='card' >
      <img className='card__image' alt={`${card.name}`} src={`${card.link}`} onMouseUp={handleClick}/>
      <button className={cardDeleteButtonClassName} onMouseUp={handleDeleteClick}
        type='button'
        aria-label='Удалить' />
      <h3 className='card__title'>{card.name}</h3>
      <button className={cardLikeButtonClassName} onMouseUp={handleLikeClick}
        type='button'
        aria-label='Лайкнуть' />
      <p className='card__like-count'>{card.likes.length}</p>
    </li>
  );
}

export default Card;