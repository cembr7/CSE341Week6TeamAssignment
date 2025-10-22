const express = require('express');
const router = express.Router();
const {validateAllContacts,validateSingleContact, validateCreateContact, validateUpdateContact, validateDeleteContact} = require('../middleware/routeValidation');

const contactsController = require('../controllers/contacts');

/**
 * @route GET /contacts
 * @desc Get all contacts
 * @returns {Array} List of contacts
 * @returns 200 - Success
 * @returns 500 - Server error
 */

router.get('/', validateAllContacts, contactsController.getAll);

/**
 * @route GET /contacts/:id
 * @desc Get a single contact by ID
 * @param {string} id - Contact ID
 * @returns {Object} Contact object
 * @returns 200 - Success
 * @returns 404 - Contact not found
 * @returns 500 - Server error
 */
router.get('/:id', validateSingleContact, contactsController.getSingle);

/**
 * @route POST /contacts
 * @desc Add a new contact
 * @param {Object} contact - Contact object
 * @returns {Object} Created contact object
 * @returns 201 - Created
 * @returns 400 - Bad request
 * @returns 500 - Server error
 */
router.post('/', validateCreateContact, contactsController.createContact);

/**
 * @route PUT /contacts/:id
 * @desc Update an existing contact by ID
 * @param {string} id - Contact ID
 * @param {Object} contact - Updated contact object
 * @returns {Object} Updated contact object
 * @returns 200 - Success
 * @returns 400 - Bad request
 * @returns 404 - Contact not found
 * @returns 500 - Server error
 */
router.put('/:id', validateUpdateContact, contactsController.updateContact);


/**
 * @route DELETE /contacts/:id
 * @desc Delete a contact by ID
 * @param {string} id - Contact ID
 * @returns {Object} Deletion confirmation
 * @returns 200 - Success
 * @returns 404 - Contact not found
 * @returns 500 - Server error
 */
router.delete('/:id', validateDeleteContact, contactsController.deleteContact);

module.exports = router;
