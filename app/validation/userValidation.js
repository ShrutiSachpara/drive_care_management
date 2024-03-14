const Joi = require('joi');
const { ROLE } = require('../utils/enum');

module.exports = {
  registerValidation: Joi.object().keys({
    name: Joi.string().required().empty().messages({
      'string.base': `Name should be a type of 'text'`,
      'string.empty': `Name cannot be an empty field`,
      'any.required': `Name is a required field`,
    }),
    email_id: Joi.string().required().empty().email().messages({
      'string.base': `Email id should be a type of 'text'`,
      'string.empty': `Email id cannot be an empty field`,
      'string.email': `Email id should be in correct format`,
      'any.required': `Email id is required`,
    }),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#'\'()*+,-./:;<=>?@[\]^_`'])[A-Za-z\d@$!%*?&#'\'()*+,-./:;<=>?@[\]^_`']{8,}$/,
        'password',
      )
      .empty()
      .required()
      .min(8)
      .messages({
        'string.base': `Password should be a type of 'text'`,
        'string.empty': `Password cannot be an empty field`,
        'string.min': 'Password length must be at least 8 characters.',
        'any.required': `Password is Required`,
        'string.pattern.name':
          'Password must contain a capital letter, a special character and a digit. Password length must be minimum 8 characters.',
      }),
    confirm_password: Joi.string()
      .empty()
      .required()
      .valid(Joi.ref('password'))
      .messages({
        'string.base': `Confirm Password should be a type of text`,
        'string.empty': 'Confirm Password is not allowed to be empty',
        'any.required': `Confirm Password is Required`,
        'any.only': `Password and confirm password should be same`,
        'string.pattern.name': `Confirm Password must contain a capital letter, a special character and a digit. Password length must be minimum 8 characters.`,
      }),
    phone_no: Joi.string()
      .required()
      .empty()
      .min(10)
      .max(15)
      .pattern(/^\d+$/)
      .messages({
        'string.base': `Phone No should be a type of 'text'`,
        'string.empty': `Phone No cannot be an empty field`,
        'string.min': 'Phone no must be 10 digit',
        'string.max': 'Phone no must be 15 digit',
        'any.required': `Phone no is required`,
      }),
    role: Joi.string()
      .required()
      .valid(ROLE.ADMIN, ROLE.MANAGER, ROLE.MECHANIC, ROLE.CUSTOMER)
      .empty()
      .messages({
        'string.base': `Role should be number`,
        'any.only': `Role must be a ${ROLE.ADMIN} or ${ROLE.MANAGER} or ${ROLE.MECHANIC} or ${ROLE.CUSTOMER}`,
        'string.empty': `Role cannot be an empty field`,
        'any.required': `Role is a required field`,
      }),
  }),

  loginValidation: Joi.object().keys({
    email_id: Joi.string().required().empty().email().messages({
      'string.base': `Email id should be a type of 'text'`,
      'string.email': `Email id should be in correct format`,
      'string.empty': `Email id cannot be an empty field`,
      'any.required': `Email id is required`,
    }),
    password: Joi.string().required().empty().messages({
      'string.base': `Password should be a type of 'text'`,
      'string.empty': `Password cannot be an empty field`,
      'any.required': `Password is a required field`,
    }),
  }),

  editProfileValidation: Joi.object().keys({
    name: Joi.string().optional().allow('').messages({
      'string.base': `Name is should be type of a text`,
    }),
    phone_no: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional()
      .allow('')
      .messages({
        'string.pattern.base': `Phone no  must be a 10-digit numeric value `,
      }),
  }),
};
