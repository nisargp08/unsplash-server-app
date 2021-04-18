import { code, upload } from '../../config/app';
import uploadFileToS3 from '../../config/aws.s3';
import PhotoModel from './photo.model';

function getErrorMessage(res, statusCode, error) {
  console.log(error);
  res.status(statusCode).json(`Error occured : ${error}`);
}

const insertPhoto = (req, res) => {
  // Use multer's upload function to temporarily store file on the server
  upload(req, res, (err) => {
    if (err) {
      getErrorMessage(res, code.badRequest, err);
    }
    const fileToUpload = req.file;
    // After receiving the file from multer, upload that file to s3 bucket
    // Iffe
    (async () => {
      try {
        const result = await uploadFileToS3(fileToUpload);
        // Add the file to mongodb so that we can use it to fetch it at a later date
        const doc = await PhotoModel.create({
          label: req.body.label,
          location: result.Location,
          aws_key: result.key,
        });
        // Return response if successfull
        if (doc) {
          res.status(code.created).json(doc);
        }
      } catch (error) {
        // Else return error with informative text
        getErrorMessage(res, code.badRequest, error);
      }
    })();
  });
};
export default insertPhoto;
