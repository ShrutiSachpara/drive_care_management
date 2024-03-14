const { ROLE } = require('../utils/enum');

module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    'User',
    {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      email_id: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone_no: {
        type: Sequelize.STRING(15),
        unique: true,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING(10),
        isIn: [ROLE.ADMIN, ROLE.MANAGER, ROLE.MECHANIC, ROLE.CUSTOMER],
        allowNull: false,
      },
      profile_image: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN(1),
        defaultValue: false,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN(1),
        defaultValue: false,
      },
    },
    { freezeTableName: true, timestamps: false },
  );
};
