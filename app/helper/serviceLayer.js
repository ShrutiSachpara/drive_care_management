module.exports = {
  create: (collection, insertData, transaction) => {
    return collection.create(insertData, { transaction: transaction });
  },

  bulkCreate: (collection, insertData, transaction) => {
    return collection.bulkCreate(insertData, { transaction: transaction });
  },

  findOne: (collection, condition, selectAttribute) => {
    return collection.findOne({
      attributes: selectAttribute,
      where: condition,
    });
  },

  update: (collection, condition, selectAttribute) => {
    return collection.update(selectAttribute, {
      where: condition,
    });
  },

  destroy: (collection, condition) => {
    return collection.destroy({
      where: condition,
    });
  },

  findAll: (collection, condition, selectAttribute) => {
    return collection.findAll({
      attributes: selectAttribute,
      where: condition,
    });
  },
};
