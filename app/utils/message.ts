export enum message {
  //common message
  NOT_FOUND = 'data not found.',
  FAILED_TO = 'Failed to',
  UPDATE_SUCCESS = 'updated successfully.',
  GET_SUCCESS = 'get successfully.',
  ALREADY_EXIST = 'already exist.',
  ALREADY_UPDATE = 'already update.',

  //register user
  ALREADY_REGISTERED = 'already registered',
  REGISTERED_SUCCESS = 'Congratulation! You are registered successfully',

  //login
  USER_NOT_FOUND = 'User with this email does\'nt exist.',
  LOGIN_SUCCESS = 'You have been login successfully.',
  DOES_NOT_MATCH = 'Credentials dose not match',

  //token
  AUTH_MISSING = 'Authorization header is missing',
  ACCESS_REQUIRED = 'Valid access required',
  TOKEN_EXPIRED = 'Token is expired',
  TOKEN_INVALID = 'Token is invalid',
  TOKEN_MISSING = 'Token is missing',

  NOT_UPDATE_PASSWORD = 'Your password is not updated',
  INCORRECT_PASSWORD = 'password is incorrect',
  SEND_SUCCESS = 'send successfully',
}
