export const INPUT_TYPES = {
  'fullName': 'text',
  'email': 'email',
  'username': 'text',
  'password': 'password',
}

export const PLACEHOLDERS = {
  'fullName': 'Enter your full name',
  'email': 'Enter your email',
  'username': 'Choose a username',
  'password': 'Create your password',
}

export const LABELS = {
  'fullName': 'Full Name',
  'email': 'Email',
  'username': 'Username',
  'password': 'Password',
}

export const VALIDATION_ERRORS = {
  'fullName': {
    'general': 'Please enter your full name.',
  },
  'email': {
    'general': 'Please enter a valid email address.',
  },
  'username': {
    'empty': 'Please enter a username.',
    'unavailable': 'This username is unavailable.',
  },
  'password': {
    'general': 'Please enter a valid password.',
  },
}

export const STEPS = {
  0: 'fullName',
  1: 'email',
  2: 'username',
  3: 'password',
}
