'use strict';

var jugglingdb = require('jugglingdb');
var schema = new jugglingdb.Schema('memory');
var manifest = require('./manifest');

describe("A schema", function() {

  var user, passport, book;

  beforeAll(function() {

    require('../').for(schema).extend({
      manifest: manifest,
      autoCreatedAt: true,
      autoUpdatedAt: true,
    });

    user = new schema.models.User({
      id: 1,
      name: 'John'
    });

    passport = user.passports.build();
    book = user.books.build();
    
  });

  it("contains models defined in manifest", function() {
    expect(schema.models.User).toBeDefined();
    expect(schema.models.Passport).toBeDefined();
    expect(schema.models.Book).toBeDefined();
  });

  it("contains User with all pre-defined prorperties", function() {
    expect(user.id).toBe(1);
    expect(user.name).toBe('John');
    expect(user.createdAt instanceof Date).toBeTruthy();
    expect(user.updatedAt instanceof Date).toBeTruthy();
  })

  it("contains User with relations", function() {
    expect(typeof user.passports).toBe('function');
    expect(typeof user.books).toBe('function');
    expect(user.posts).toBeUndefined();
  })

  it("contains Passport with foreignKey", function() {    
    expect(passport.userId).toBe(1);
  })

  it("contains Book with foreignKey", function() {
    expect(book.authorId).toBe(1);
    expect(book.userId).toBeUndefined();
  })

});