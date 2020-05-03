import React from 'react';

export const XIcon = ({onClick, className}) => {
  className = className || "";
  return (
      <svg onClick={onClick}
           className={`${className}delete bi bi-x`} width="1.15em" height="1.15em" viewBox="0 0 16 16" fill="currentColor"
           xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z"
              clipRule="evenodd"/>
        <path fillRule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z"
              clipRule="evenodd"/>
      </svg>
  )
}