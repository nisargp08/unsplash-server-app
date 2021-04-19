import { Router } from 'express';
import {
  insertPhoto, getOnePhoto, getAllPhotos, deleteOnePhoto,
} from './photo.controller';

const router = Router();

router.route('/')
  .get(getAllPhotos)
  .post(insertPhoto);

router.route('/:id')
  .get(getOnePhoto)
  .delete(deleteOnePhoto);

export default router;
