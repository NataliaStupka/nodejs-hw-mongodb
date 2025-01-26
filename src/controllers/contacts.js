//функції для обробки запитів

import {
  createContact,
  deleteContact,
  getContact,
  getContactById,
  updataContact,
} from '../db/services/contacts.js';
import createHttpError from 'http-errors'; //ПОМИЛКА пошуку контакту за id

export const getContactsController = async (req, res) => {
  const contacts = await getContact();
  // res.json(contacts);
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const contactId = req.params.contactId;
  const contact = await getContactById(contactId);

  //помилка з http-errors'
  if (!contact) {
    throw createHttpError(404, 'Contact not found'); //передаємо код помилки, рядок-опис
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id: ${contactId}!`,
    data: contact,
  });
};

//POST
export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

//PATCH
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updataContact(contactId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

//Delete
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(204).send();
};
