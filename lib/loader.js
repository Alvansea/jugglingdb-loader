'use strict';

/**
 *  jugglingdb schema loader
 */
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var Schema = require('jugglingdb').Schema;

module.exports = function(schema) {

  var loader = {
    
    schema: schema,

    _getColumes: function(model, autoCreatedAt, autoUpdatedAt) {
      var cols = {};
      for(var colname in model) {
        var col = model[colname];
        if(col.type) {
          if(typeof(col.type) == 'string') {
            switch(col.type.toLowerCase()) {
              case 'string':
                col.type = String;
                break;
              case 'boolean':
                col.type = Boolean;
                break;
              case 'date':
                col.type = Date;
                break;
              case 'text':
                col.type = Schema.Text;
                break;
            }
          }
          cols[colname] = col;
        }
      }
      if(!cols.createdAt && autoCreatedAt) {
        cols.createdAt = {
          type: Date,
          default: function() {
            return new Date();
          }
        }
      }
      if(!cols.updatedAt && autoUpdatedAt) {
        cols.updatedAt = {
          type: Date,
          default: function() {
            return new Date();
          }
        }
      }
      return cols;
    },

    _getRelations: function(model) {
      var rels = {};
      for(var colname in model) {
        var col = model[colname];
        if(col.collection && col.via) {
          rels[colname] = col;
        }
      }
      return rels;
    },

    extend: function(options) {
      return this.load(
        options.manifest, 
        options.autoCreatedAt, 
        options.autoUpdatedAt).scan(options.scan);
    },

    load: function(models, autoCreatedAt, autoUpdatedAt) {

      if(!models) {
        return this;
      }

      var schema = this.schema;

      // init models
      for (var name in models) {
        var model = models[name];
        var cols = this._getColumes(model, autoCreatedAt, autoUpdatedAt);
        var item = schema.define(name, cols, model.__settings);
      }
      // init relations
      for (var name in models) {
        var relations = this._getRelations(models[name]);
        for (var relname in relations) {
          var rel = relations[relname];
          var parent = schema.models[name];
          var child = schema.models[rel.collection];
          if (parent && child) {
            parent.hasMany(relname, {
              model: child,
              foreignKey: rel.via + 'Id'
            });
            child.belongsTo(rel.via, {
              model: parent,
              foreignKey: rel.via + 'Id'
            })
          } else {
            console.log('ERROR model ' + rel.collection + ' does not exist!');
          }
        }
      }

      return this;
    },

    scan: function(dir, filter) {

      if(!dir) {
        return this;
      }

      var filterCb;

      if(typeof(filter) == 'function') {
        filterCb = filter;
      } else {
        filterCb = function(file) {
          return (file.indexOf('.') !== 0) && (file.indexOf('__') !== 0) && (file !== 'index.js');
        }
      }

      fs.readdirSync(dir)
        .filter(filterCb)
        .forEach(function(file) {
          require(path.join(dir, file));
        })

      return this;
    }
  };

  return loader;
}