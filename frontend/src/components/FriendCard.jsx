import React from 'react'
import { LANGUAGE_TO_FLAG } from '../constants/index.js';
import { Link } from 'react-router-dom';

const FriendCard = ({ friend }) => {
  return (
    <div className='card bg-base-200 hover:shadow-md transition-shadow'>
      <div className='card-body p-4'>
        <div className='flex flex-col gap-3'>
          {/* Avatar + Name */}
          <div className='flex items-center gap-3'>
            <div className='avatar size-12'>
              <img src={friend.profilePic} alt={friend.fullName} />
            </div>
            <h3 className='font-semibold truncate'>
              {friend.fullName}
            </h3>
          </div>

          {/* Languages */}
          <div className='flex flex-wrap gap-1.5'>
            <span className='badge badge-secondary text-xs flex items-center'>
              {getLanguageFlag(friend.nativeLanguage)}
              Native: {friend.nativeLanguage}
            </span>
            <span className='badge badge-outline text-xs flex items-center'>
              {getLanguageFlag(friend.learningLanguage)}
              Learning: {friend.learningLanguage}
            </span>
          </div>

          {/* Message Button */}
          <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
            Message
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FriendCard

// ✅ FIXED getLanguageFlag (removed async, used [] access)
export const getLanguageFlag = (language) => {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower]; // ✅ FIXED

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={langLower}
        className='h-3 mr-1 inline-block'
      />
    )
  }
  return null;
}
