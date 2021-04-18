import { Router } from 'express';
import insertPhoto from './photo.controller';

const router = Router();

router.route('/').post(insertPhoto);

export default router;
