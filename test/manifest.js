'use strict';

module.exports = {
  
  'User': {
    name:         { type: 'string', index: true, allownulls: false },

    passports:    { collection: 'Passport', via: 'user' },
    books:        { collection: 'Book', via: 'author' },
  },

  'Passport': {
    loginName:    { type: 'string', allownulls: false },
    password:     { type: 'string', allownulls: false },
  },

  'Book': {
    title:        { type: 'string' },
    summary:      { type: 'text', default: false },
  },
}