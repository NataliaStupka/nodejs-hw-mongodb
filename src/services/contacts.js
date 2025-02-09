import { ContactCollection } from '../db/models/contacts.js';

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
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  //кількість контактів, що 'відступаємо'
  const offset = (page - 1) * perPage; //(поточна сторінка - 1)*кільк.на сторінці

  //filter
  const contactQuery = ContactCollection.find();
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
export const getContactById = async (contactId) => {
  const contact = await ContactCollection.findById(contactId);
  return contact;
};

//POST
export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

//PATCH  .findOneAndUpdate(filter, update, options, callback)
export const updataContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id: contactId }, //_id - стандартне ім'я для первинного ключа
    payload,
    {
      new: true, //поверне оновлений документ (після оновлення).
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

//DELETE   .findOneAndDelete(filter, options, callback)
export const deleteContact = async (contactId) => {
  const contact = await ContactCollection.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};
