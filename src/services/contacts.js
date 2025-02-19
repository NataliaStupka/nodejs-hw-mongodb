import { ContactCollection } from '../db/models/contacts.js';
import { Types } from 'mongoose';

//розрахунок, pagination
const createPaginationMetadata = (page, perPage, count) => {
  // кількість сторінок //Math.ceil - округлення до верхнього занчення
  const totalPages = Math.ceil(count / perPage); //загальна кількість / кільк.на сторінці
  const hasNextPage = count > page * perPage;
  const hasPreviousPage = page !== 1 && page <= totalPages + 1;
  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

//GET-all
export const getContact = async ({
  userId, // приналежність
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  //кількість контактів, що 'відступаємо'
  const offset = (page - 1) * perPage; //(поточна сторінка - 1)*кільк.на сторінці

  //filter
  const contactQuery = ContactCollection.find({ userId }); // { userId } приналежність
  if (filter.contactType) {
    contactQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite || filter.isFavourite === false) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  //skip()-скільки пропустити/відступити,.limit()-всього на сторінці
  const contacts = await ContactCollection.find()
    .merge(contactQuery)
    .skip(offset)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const contactsCount = await ContactCollection.find()
    .merge(contactQuery)
    .countDocuments(); //кількість контактів

  //Promise.all
  //const [contacts, contactsCount] = await Promise.all([]);

  const paginationMetaData = createPaginationMetadata(
    page,
    perPage,
    contactsCount,
  );

  //відповідь запиту
  return { data: contacts, ...paginationMetaData };
};

//GET-by_id
export const getContactById = async (contactId, userId) => {
  const contactObjectId = new Types.ObjectId(contactId); // contactId на ObjectId
  const userObjectId = new Types.ObjectId(userId); // Якщо userId - рядок, також конвертуємо його в ObjectId
  const contact = await ContactCollection.findOne({
    _id: contactObjectId,
    userId: userObjectId,
  });
  // console.log('contactId:', contactId); //contactId2: 67b3a61e0f7dafce84477b9e
  // console.log('userId:', userId); //userId2: new ObjectId('67b39e9a75a34394c3abb635')

  return contact;
};

//POST    //payload: name, phoneNumber, isFavourite, contactType, userId
export const createContact = async (payload) => {
  console.log('1ser-post-payload!', payload);

  const contact = await ContactCollection.create({ ...payload });
  return contact;
};

//PATCH  .findOneAndUpdate(filter, update, options, callback)
export const updataContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  // const contactObjectId = new Types.ObjectId(contactId);
  // const userObjectId = new Types.ObjectId(userId);
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id: contactId, userId }, //_id - стандартне ім'я для первинного ключа
    payload, // Оновлені дані
    {
      new: true, //поверне оновлений документ (після оновлення).
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  //toObject() конвертує результат Mongoose документу в "простий" об'єкт JavaScript, позбавлений метаданих, таких як $__, _doc, і іншого.
  return {
    ...rawResult.value.toObject(),
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

//DELETE   .findOneAndDelete(filter, options, callback)
export const deleteContact = async (contactId, userId) => {
  const contact = await ContactCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};
