import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
//обгортка try/catch
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
//Валідація
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { validateMongoId } from '../middlewares/validateMongoId.js';

const router = Router();

router.use('/contacts/:contactId', validateMongoId('contactId')); //відпрацює скрізь де є шлях /:contactId

//контролер у роуті
router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

// POST
router.post(
  '/contacts',
  validateBody(createContactSchema), //валідація
  ctrlWrapper(createContactController),
);

//PATCH - update
router.patch(
  '/contacts/:contactId',
  validateBody(updateContactSchema), //валідація
  ctrlWrapper(patchContactController),
);

//DELETE
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default router;
