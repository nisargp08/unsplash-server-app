import { Router } from 'express';
import { insertPhoto, getOnePhoto, getAllPhotos } from './photo.controller';

const router = Router();

router.route('/')
  .get(getAllPhotos)
  .post(insertPhoto);

router.route('/:id')
  .get(getOnePhoto);

export default router;
