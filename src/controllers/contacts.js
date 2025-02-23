//функції для обробки запитів
// import { Types } from 'mongoose';
import {
  createContact,
  deleteContact,
  getContact,
  getContactById,
  updataContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors'; //ПОМИЛКА пошуку контакту за id
import { parsePaginationParams } from '../utils/parsePaginationParams.js'; //page, perPage
import { parseSortParams } from '../utils/parseSortParams.js'; //сортування
import { parseFilters } from '../utils/parseFilterParams.js';
import { getEnvVar } from '../utils/getEnvVar.js';

//GET_all
export const getContactsController = async (req, res) => {
  //const { page, perPage } = req.query;
  const { _id: userId } = req.user; // приналежність
  const { page, perPage } = parsePaginationParams(req.query); //pagination
  const { sortOrder, sortBy } = parseSortParams(req.query); //sort
  const filter = parseFilters(req.query); //filter

  const contacts = await getContact({
    userId, // приналежність
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
  });
  // res.json(contacts);
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
//GET_by-id
export const getContactByIdController = async (req, res) => {
  const { _id: userId } = req.user; // приналежність
  const contactId = req.params.contactId;
  const contact = await getContactById(contactId, userId);

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

//POST - create
export const createContactController = async (req, res) => {
  const photo = req.file; //збереження фото: fieldname, originalname, path, ...

  const contact = await createContact({
    ...req.body, //name, phoneNumber, isFavourite, contactType
    userId: req.user._id, //приналежність до user
    photo, ////збереження фото
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

//PATCH
export const patchContactController = async (req, res, next) => {
  const { _id: userId } = req.user; //приналежність
  const { contactId } = req.params;

  const photo = req.file; //збереження фото

  const result = await updataContact(contactId, userId, { ...req.body, photo });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};

//DELETE
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(204).send();
};
