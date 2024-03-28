import Joi from 'joi';
import { ROLE } from '../utils/enum';

export const registerValidation = Joi.object({
  name: Joi.string().required().empty().messages({
    'string.base': 'Name should be a type of \'text\'',
    'string.empty': 'Name cannot be an empty field',
    'any.required': 'Name is a required field',
  }),
  email_id: Joi.string().required().empty().email().messages({
    'string.base': 'Email id should be a type of \'text\'',
    'string.empty': 'Email id cannot be an empty field',
    'string.email': 'Email id should be in correct format',
    'any.required': 'Email id is required',
  }),
  password: Joi.string()
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .empty()
    .required()
    .min(8)
    .messages({
      'string.base': 'Password should be a type of \'text\'',
      'string.empty': 'Password cannot be an empty field',
      'string.min': 'Password length must be at least 8 characters.',
      'any.required': 'Password is Required',
      'string.pattern.name':
        'Password must contain a capital letter, a special character and a digit. Password length must be minimum 8 characters.',
    }),
  confirm_password: Joi.string()
    .empty()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'string.base': 'Confirm Password should be a type of text',
      'string.empty': 'Confirm Password is not allowed to be empty',
      'any.required': 'Confirm Password is Required',
      'any.only': 'Password and confirm password should be same',
      'string.pattern.name':
        'Confirm Password must contain a capital letter, a special character and a digit. Password length must be minimum 8 characters.',
    }),
  phone_no: Joi.string()
    .required()
    .empty()
    .min(10)
    .max(15)
    .pattern(/^\d+$/)
    .messages({
      'string.base': 'Phone No should be a type of \'text\'',
      'string.empty': 'Phone No cannot be an empty field',
      'string.min': 'Phone no must be 10 digit',
      'string.max': 'Phone no must be 15 digit',
      'any.required': 'Phone no is required',
    }),
  role: Joi.string()
    .required()
    .valid(ROLE.ADMIN, ROLE.MANAGER, ROLE.MECHANIC, ROLE.CUSTOMER)
    .empty()
    .messages({
      'string.base': 'Role should be number',
      'any.only': `Role must be a ${ROLE.ADMIN} or ${ROLE.MANAGER} or ${ROLE.MECHANIC} or ${ROLE.CUSTOMER}`,
      'string.empty': 'Role cannot be an empty field',
      'any.required': 'Role is a required field',
    }),
});

export const loginValidation = Joi.object({
  email_id: Joi.string().required().empty().email().messages({
    'string.base': 'Email id should be a type of \'text\'',
    'string.email': 'Email id should be in correct format',
    'string.empty': 'Email id cannot be an empty field',
    'any.required': 'Email id is required',
  }),
  password: Joi.string().required().empty().messages({
    'string.base': 'Password should be a type of \'text\'',
    'string.empty': 'Password cannot be an empty field',
    'any.required': 'Password is a required field',
  }),
});

export const editProfileValidation = Joi.object({
  name: Joi.string().optional().allow('').messages({
    'string.base': 'Name is should be type of a text',
  }),
  phone_no: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Phone no  must be a 10-digit numeric value ',
    }),
});

export const resetPasswordValidation = Joi.object({
  currentPassword: Joi.string().empty().required().messages({
    'string.base': 'Current password is should be type of text',
    'string.empty': 'Current password is not a empty field',
    'any.required': 'Current password is a required field',
  }),
  newPassword: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+,.?]{8,30}$/)
    .empty()
    .required()
    .messages({
      'string.pattern.base':
        'Invalid password. New password must be between 8 and 30 characters and contain at least one lowercase letter, one uppercase letter, and one digit.',
      'string.empty': 'New password is not a empty field',
      'any.required': 'New password is a required field',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .empty()
    .messages({
      'string.base': 'Confirm password should be type of string',
      'any.only': 'Confirm password and new password should be same\'',
      'string.empty': 'Confirm password is not a empty field',
      'any.required': 'Confirm password is a required field',
    }),
});

export const verifyEmailValidation = Joi.object({
  email_id: Joi.string()
    .empty()
    .email({ tlds: { allow: true } })
    .required()
    .messages({
      'string.base': 'Email should be type of string',
      'string.empty': 'Email is not a empty field',
      'string.email': 'Email format not valid',
      'any.required': 'Email is a required field',
    }),
});

export const updatePasswordValidation = Joi.object({
  email_id: Joi.string()
    .empty()
    .email({ tlds: { allow: true } })
    .required()
    .messages({
      'string.base': 'Email should be type of string',
      'string.empty': 'Email is not a empty field',
      'string.email': 'Email format not valid',
      'any.required': 'Email is a required field',
    }),
  otp: Joi.number().empty().required().messages({
    'string.base': 'Otp should be type of number',
    'string.empty': 'Otp is not a empty field',
    'any.required': 'Otp is a required field',
  }),
  newPassword: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+,.?]{8,30}$/)
    .empty()
    .required()
    .messages({
      'string.pattern.base':
        'Invalid password. New password must be between 8 and 30 characters and contain at least one lowercase letter, one uppercase letter, and one digit.',
      'string.empty': 'New password is not a empty field',
      'any.required': 'New password is a required field',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .empty()
    .required()
    .messages({
      'string.base': 'Confirm password should be type of string',
      'any.only': 'Confirm password and password should be same\'',
      'string.empty': 'Confirm password is not a empty field',
      'any.required': 'Confirm password is a required field',
    }),
});
