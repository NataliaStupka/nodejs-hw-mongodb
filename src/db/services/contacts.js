import { ContactCollection } from '../models/contacts.js';

export const getContact = async () => {
  const contacts = await ContactCollection.find();
  return contacts;
};

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
