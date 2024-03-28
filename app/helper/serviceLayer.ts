/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from 'sequelize';

export const DbService = {
  create: (collection: any, insertData: unknown, transaction?: Transaction) => {
    return collection.create(insertData, { transaction });
  },

  bulkCreate: (
    collection: any,
    insertData: unknown[],
    transaction?: Transaction,
  ) => {
    return collection.bulkCreate(insertData, { transaction });
  },

  findOne: (collection: any, condition: unknown, selectAttribute?: any) => {
    return collection.findOne({
      attributes: selectAttribute,
      where: condition,
    });
  },

  update: (collection: any, condition: unknown, selectAttribute: unknown) => {
    return collection.update(selectAttribute, {
      where: condition,
    });
  },

  destroy: (collection: any, condition: unknown) => {
    return collection.destroy({
      where: condition,
    });
  },
};
