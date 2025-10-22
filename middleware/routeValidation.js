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
  }
  next();
}

const validateSingleContact = (req, res, next) => {
    const {id} = req.params;

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

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: 'Request body is required',
      requiredFields: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday']
    });
  }

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
    errors.push('firstName is required and must be a non-empty string');
  } else if (firstName.length > 50) {
    errors.push('firstName cannot exceed 50 characters');
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
    errors.push('lastName is required and must be a non-empty string');
  } else if (lastName.length > 50) {
    errors.push('lastName cannot exceed 50 characters');
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('email is required');
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('email must be a valid email address');
    }
  }

  if (!favoriteColor || typeof favoriteColor !== 'string' || favoriteColor.trim().length === 0) {
    errors.push('favoriteColor is required and must be a non-empty string');
  } else if (favoriteColor.length > 30) {
    errors.push('favoriteColor cannot exceed 30 characters');
  }

  if (!birthday || typeof birthday !== 'string' || birthday.trim().length === 0) {
    errors.push('birthday is required');
  } else {
    const birthdayRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!birthdayRegex.test(birthday.trim())) {
      errors.push('birthday must be in MM/DD/YYYY format');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed for POST /contacts',
      errors: errors
    });
  }

  next();
};

const validateUpdateContact = (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;
  const errors = [];

  if (!id) {
    return res.status(400).json({
      message: 'Contact ID is required in URL path'
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid contact ID format',
      providedId: id
    });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: 'Request body is required for update',
      requiredFields: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday']
    });
  }

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
    errors.push('firstName is required and must be a non-empty string');
  } else if (firstName.length > 50) {
    errors.push('firstName cannot exceed 50 characters');
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
    errors.push('lastName is required and must be a non-empty string');
  } else if (lastName.length > 50) {
    errors.push('lastName cannot exceed 50 characters');
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('email is required');
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('email must be a valid email address');
    }
  }

  if (!favoriteColor || typeof favoriteColor !== 'string' || favoriteColor.trim().length === 0) {
    errors.push('favoriteColor is required and must be a non-empty string');
  } else if (favoriteColor.length > 30) {
    errors.push('favoriteColor cannot exceed 30 characters');
  }

  if (!birthday || typeof birthday !== 'string' || birthday.trim().length === 0) {
    errors.push('birthday is required');
  } else {
    const birthdayRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!birthdayRegex.test(birthday.trim())) {
      errors.push('birthday must be in MM/DD/YYYY format');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed for PUT /contacts/:id',
      errors: errors,
      contactId: id
    });
  }

  next();
};

const validateDeleteContact = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid contact ID format',
      providedId: id
    });
  }

  next();
};

module.exports = {
  validateAllContacts,
  validateSingleContact,
  validateCreateContact,
  validateUpdateContact,
  validateDeleteContact
};

