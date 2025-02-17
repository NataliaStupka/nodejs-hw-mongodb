import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; //обгортка try/catch
import { validateBody } from '../middlewares/validateBody.js'; //Валідація
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { validateMongoId } from '../middlewares/validateMongoId.js'; //валідація id
import { authentificate } from '../middlewares/authenticate.js';

const contactsRouter = Router();

contactsRouter.use('/', authentificate); //аунтефікація (без авторизації)

contactsRouter.use('/:contactId', validateMongoId('contactId')); //відпрацює скрізь де є шлях /:contactId
//contactsRouter.use('/contacts/:contactId', validateMongoId('contactId')); //відпрацює скрізь де є шлях /:contactId

//контролер у роуті
contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:contactId', ctrlWrapper(getContactByIdController));

// POST
contactsRouter.post(
  '/',
  validateBody(createContactSchema), //валідація
  ctrlWrapper(createContactController),
);

//PATCH - update
contactsRouter.patch(
  '/:contactId',
  validateBody(updateContactSchema), //валідація
  ctrlWrapper(patchContactController),
);

//DELETE
contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactController));

export default contactsRouter;
