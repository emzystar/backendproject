const Contact = require('../models/contactModel')
const asyncHandler = require('express-async-handler')
// description get all contacts
// @route Get /api/contacts
// @access private

const getContacts = asyncHandler (async (req, res) => {
  const contacts =  await Contact.find({user_id: req.user.id })
  res.status(200).json(contacts);
});



// description create contact
// @route POST /api/contacts
// @access private
const createContact = asyncHandler (async (req, res) => {
    const {name, email, phone} = req.body;
    if (!name || !email || !phone){
        res.status(400);
        throw new Error('input fields are mandatory')
    }
    const contact = await Contact.create({
      name,
      email,
      phone,
      user_id: req.user.id
    })
  res.status(201).json(contact);
});



// description get contact
// @route Get /api/contact:id
// @access private

const getContact = asyncHandler (async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if(!contact) {
    res.status(404)
    throw new Error('contact not found')
  }
  res.status(200).json(contact);
});



// description update contacts
// @route PUT /api/contacts:id
// @access private
const updateContact = asyncHandler (async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if(!contact) {
    res.status(404)
    throw new Error("contact not found")
  }
  if(contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("user is not authorized to update others contacts")
  }
  const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {new: true})
  res.status(200).json(updatedContact);
});



// description delete contact
// @route DELETE /api/contacts:id
// @access private
const deleteContact = asyncHandler (async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if(!contact) {
    res.status(404)
    throw new Error("contact not found")
  }
  if(contact.user_id.toString() !== req.user.id) {
    res.status(404);
    throw new Error("user is not authorized to delete others contacts")
  }
  const deleteContact = await Contact.findByIdAndDelete(
    req.params.id,
    req.body,
  )
  res.status(200).json({msg: "contact deleted", deleteContact});
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
