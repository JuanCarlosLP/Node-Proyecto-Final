'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRoles extends Model {
    static associate(models) {
      // this.belongsTo(models.Roles, {
      //   foreignKey: "roleId"
      // })
    }
  };
  UserRoles.init({
    userId: {
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    roleId: { 
      primaryKey: true,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'UserRoles',
  });
  return UserRoles;
};