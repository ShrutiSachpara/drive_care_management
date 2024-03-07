module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "AuthUser",
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
    },
    { freezeTableName: true, timestamps: false }
  );
};
