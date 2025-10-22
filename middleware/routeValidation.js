// here was corrected instead of mongodb, we supposed to use mongoose instead
const mongoose = require('mongoose');

const validateAllContacts = (req, res, next) => {

    if (req.query.page && isNaN(req.query.page)) {        
        return res.status(400).json({            
            message: 'Invalid query parameter: page must be a number'        
        }); 
    }       
 
    if (req.query.limit && isNaN(req.query.limit)) {        
        return res.status(400).json({            
            message: 'Invalid query parameter: limit must be a number'        
        });    
    }    next();
}

const validateSingleContact = (req, res, next) => {
    const {id} = req.params.id;

    // Validate that ID parameter exists   
    if (!id) {
    return res.status(400).json({           
        message: 'Contact ID is required'        
    });    
           
}
 
    // Validate MongoDB ObjectId format   
    if (!mongoose.Types.ObjectId.isValid(id)) {     
    return res.status(400).json({           
        message: 'Invalid contact ID format. Must be a valid MongoDB ObjectId (24 hex characters).',           
        providedId: id        
    });    
    }   

    next();
        
}

const validateCreateContact = (req, res, next) => {
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;
  const errors = [];

  // Check if request body exists
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: 'Request body is required',
      requiredFields: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday']
    });
  }

  // Validate firstName
  if (!firstName) {
    errors.push('firstName is required');
  } else if (typeof firstName !== 'string') {
    errors.push('firstName must be a string');
  } else if (firstName.trim().length === 0) {
    errors.push('firstName cannot be empty or only whitespace');
  } else if (firstName.length < 1) {
    errors.push('firstName must be at least 1 character');
  } else if (firstName.length > 50) {
    errors.push('firstName cannot exceed 50 characters');
  }

  // Validate lastName
  if (!lastName) {
    errors.push('lastName is required');
  } else if (typeof lastName !== 'string') {
    errors.push('lastName must be a string');
  } else if (lastName.trim().length === 0) {
    errors.push('lastName cannot be empty or only whitespace');
  } else if (lastName.length < 1) {
    errors.push('lastName must be at least 1 character');
  } else if (lastName.length > 50) {
    errors.push('lastName cannot exceed 50 characters');
  }

  // Validate email
  if (!email) {
    errors.push('email is required');
  } else if (typeof email !== 'string') {
    errors.push('email must be a string');
  } else if (email.trim().length === 0) {
    errors.push('email cannot be empty or only whitespace');
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('email must be a valid email address (example, user@example.com)');
    }
  }

  // Validate favoriteColor
  if (!favoriteColor) {
    errors.push('favoriteColor is required');
  } else if (typeof favoriteColor !== 'string') {
    errors.push('favoriteColor must be a string');
  } else if (favoriteColor.trim().length === 0) {
    errors.push('favoriteColor cannot be empty or only whitespace');
  } else if (favoriteColor.length < 1) {
    errors.push('favoriteColor must be at least 1 character');
  } else if (favoriteColor.length > 30) {
    errors.push('favoriteColor cannot exceed 30 characters');
  }

  // Validate birthday
  if (!birthday) {
    errors.push('birthday is required');
  } else if (typeof birthday !== 'string') {
    errors.push('birthday must be a string');
  } else if (birthday.trim().length === 0) {
    errors.push('birthday cannot be empty or only whitespace');
  } else {
    const birthdayRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!birthdayRegex.test(birthday.trim())) {
      errors.push('birthday must be in MM/DD/YYYY format (e.g., 01/15/1990)');
    } else {
      // Additional date validation - check if it's a valid date
      const parts = birthday.split('/');
      const month = parseInt(parts[0]);
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      const date = new Date(year, month - 1, day);

      if (date.getMonth() + 1 !== month || date.getDate() !== day || date.getFullYear() !== year) {
        errors.push('birthday must be a valid calendar date');
      }
    }
  }

  // Check for unexpected fields
  const allowedFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];
  const providedFields = Object.keys(req.body);
  const unexpectedFields = providedFields.filter(field => !allowedFields.includes(field));

  if (unexpectedFields.length > 0) {
    errors.push(`Unexpected fields: ${unexpectedFields.join(', ')}. Only ${allowedFields.join(', ')} are allowed.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed for POST /contacts',
      errors: errors,
      receivedData: req.body
    });
  }

  next();
};

const validateUpdateContact = (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;
  const errors = [];

  // Validate ID parameter first
  if (!id) {
    return res.status(400).json({
      message: 'Contact ID is required in URL path'
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid contact ID format. Must be a valid MongoDB ObjectId (24 hex characters).',
      providedId: id
    });
  }

  // Check if request body exists
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: 'Request body is required for update',
      requiredFields: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday']
    });
  }

  // Validate firstName
  if (!firstName) {
    errors.push('firstName is required');
  } else if (typeof firstName !== 'string') {
    errors.push('firstName must be a string');
  } else if (firstName.trim().length === 0) {
    errors.push('firstName cannot be empty or only whitespace');
  } else if (firstName.length < 1) {
    errors.push('firstName must be at least 1 character');
  } else if (firstName.length > 50) {
    errors.push('firstName cannot exceed 50 characters');
  }

  // Validate lastName
  if (!lastName) {
    errors.push('lastName is required');
  } else if (typeof lastName !== 'string') {
    errors.push('lastName must be a string');
  } else if (lastName.trim().length === 0) {
    errors.push('lastName cannot be empty or only whitespace');
  } else if (lastName.length < 1) {
    errors.push('lastName must be at least 1 character');
  } else if (lastName.length > 50) {
    errors.push('lastName cannot exceed 50 characters');
  }

  // Validate email
  if (!email) {
    errors.push('email is required');
  } else if (typeof email !== 'string') {
    errors.push('email must be a string');
  } else if (email.trim().length === 0) {
    errors.push('email cannot be empty or only whitespace');
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('email must be a valid email address (e.g., user@example.com)');
    }
  }

  // Validate favoriteColor
  if (!favoriteColor) {
    errors.push('favoriteColor is required');
  } else if (typeof favoriteColor !== 'string') {
    errors.push('favoriteColor must be a string');
  } else if (favoriteColor.trim().length === 0) {
    errors.push('favoriteColor cannot be empty or only whitespace');
  } else if (favoriteColor.length < 1) {
    errors.push('favoriteColor must be at least 1 character');
  } else if (favoriteColor.length > 30) {
    errors.push('favoriteColor cannot exceed 30 characters');
  }

  // Validate birthday
  if (!birthday) {
    errors.push('birthday is required');
  } else if (typeof birthday !== 'string') {
    errors.push('birthday must be a string');
  } else if (birthday.trim().length === 0) {
    errors.push('birthday cannot be empty or only whitespace');
  } else {
    const birthdayRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!birthdayRegex.test(birthday.trim())) {
      errors.push('birthday must be in MM/DD/YYYY format (e.g., 01/15/1990)');
    } else {
      // Additional date validation
      const parts = birthday.split('/');
      const month = parseInt(parts[0]);
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      const date = new Date(year, month - 1, day);

      if (date.getMonth() + 1 !== month || date.getDate() !== day || date.getFullYear() !== year) {
        errors.push('birthday must be a valid calendar date');
      }
    }
  }

  // Check for unexpected fields
  const allowedFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];
  const providedFields = Object.keys(req.body);
  const unexpectedFields = providedFields.filter(field => !allowedFields.includes(field));

  if (unexpectedFields.length > 0) {
    errors.push(`Unexpected fields: ${unexpectedFields.join(', ')}. Only ${allowedFields.join(', ')} are allowed.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed for PUT /contacts/:id',
      errors: errors,
      contactId: id,
      receivedData: req.body
    });
  }

  next();
};

module.exports = {
  validateAllContacts,
  validateSingleContact,
  validateCreateContact,
  validateUpdateContact
};

