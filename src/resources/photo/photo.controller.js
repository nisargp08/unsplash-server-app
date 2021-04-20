import fs from 'fs';
import util from 'util';
import { code, upload } from '../../config/app';
import { uploadFileToS3, getFileFromS3ByKey, deleteFileFromS3ByKey } from '../../config/aws.s3';
import PhotoModel from './photo.model';

// Create a unlink function that returns a promise instead of callback
const unlinkFile = util.promisify(fs.unlink);
function getErrorMessage(res, statusCode, error) {
  console.log(error);
  res.status(statusCode).json(`Error occured : ${error}`);
}

export const insertPhoto = (req, res) => {
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
        // Remove the file from system storage
        await unlinkFile(fileToUpload.path);
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
export const getOnePhoto = async (req, res) => {
  try {
    // Find the record from the database using the provided id
    const doc = await PhotoModel.findById(req.params.id);
    // If doc found then
    if (doc) {
      // Find the file from s3 bucket using doc key
      const file = await getFileFromS3ByKey(doc.aws_key);
      if (file) {
        /* as received data 'file' is an open filestream we can pipe
        that stream to response object back to client */
        file.pipe(res.status(code.ok));
      }
    }
  } catch (error) {
    getErrorMessage(res, code.badRequest, error);
  }
};
export const getAllPhotos = async (req, res) => {
  try {
    // Get all docs from database
    const docs = await PhotoModel.find();
    if (docs) {
      // Get file id's of the files in db and store it in the array
      const fileIds = docs.map((file) => ({
        // eslint-disable-next-line no-underscore-dangle
        id: file._id,
        label: file.label,
      }));
      res.status(code.ok).json(fileIds);
    }
  } catch (error) {
    getErrorMessage(res, code.badRequest, error);
  }
};
export const deleteOnePhoto = async (req, res) => {
  try {
    // Get file key from req params
    const fileKey = req.params.id;
    // Get aws_key from the id
    const doc = await PhotoModel.findById(fileKey);
    // If any record found then
    if (fileKey) {
      // Delete from s3 bucket first
      await deleteFileFromS3ByKey(doc.aws_key);
      // Then delete from database
      const deletedFile = await PhotoModel.findByIdAndDelete(fileKey);
      // Return the statuscode and send the delete object
      res.status(code.ok).json(deletedFile);
    }
  } catch (error) {
    getErrorMessage(res, code.badRequest, error);
  }
};
