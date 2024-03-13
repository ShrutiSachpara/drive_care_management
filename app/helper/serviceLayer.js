module.exports = {
  create: async (collection, insertData, transaction) => {
    return collection.create(insertData, { transaction: transaction });
  },

  bulkCreate: async (collection, insertData, transaction) => {
    return collection.bulkCreate(insertData, { transaction: transaction });
  },

  findOne: async (collection, condition, selectAttribute) => {
    return collection.findOne({
      attributes: selectAttribute,
      where: condition,
    });
  },

  update: async (collection, condition, selectAttribute) => {
    return collection.update(selectAttribute, {
      where: condition,
    });
  },

  destroy: async (collection, condition) => {
    return collection.destroy({
      where: condition,
    });
  },

  findAll: async (collection, condition, selectAttribute) => {
    return collection.findAll({
      attributes: selectAttribute,
      where: condition,
    });
  },
};
