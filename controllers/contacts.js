const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

/*const getAll = async (req, res) => {
  const result = await mongodb.getDb().db().collection('contacts').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};*/
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('contacts').find();
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (error) {
    console.error('Error in GET /contacts:', error);
    res.status(500).json({ message: 'Error retrieving contacts', error: error.message });
  }
};

/*const getSingle = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection('contacts').find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};*/
const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('contacts').find({ _id: userId });
    const lists = await result.toArray();

    if (lists.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  } catch (error) {
    console.error('Error in GET /contacts/:id:', error);
    res.status(500).json({ message: 'Error retrieving contact', error: error.message });
  }
};

/*const createContact = async (req, res) => {
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb.getDb().db().collection('contacts').insertOne(contact);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the contact.');
  }
};*/
const createContact = async (req, res) => {
  try {
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    const response = await mongodb.getDb().db().collection('contacts').insertOne(contact);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Failed to create contact' });
    }
  } catch (error) {
    console.error('Error in POST /contacts:', error);
    res.status(500).json({ message: 'Error creating contact', error: error.message });
  }
};

/*const updateContact = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  // be aware of updateOne if you only want to update specific fields
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('contacts')
    .replaceOne({ _id: userId }, contact);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the contact.');
  }
};*/
const updateContact = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    const response = await mongodb
      .getDb()
      .db()
      .collection('contacts')
      .replaceOne({ _id: userId }, contact);

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Failed to update contact' });
    }
  } catch (error) {
    console.error('Error in PUT /contacts/:id:', error);
    res.status(500).json({ message: 'Error updating contact', error: error.message });
  }
};

/*const deleteContact = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('contacts').remove({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
  }
};*/
const deleteContact = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('contacts').deleteOne({ _id: userId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /contacts/:id:', error);
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};
