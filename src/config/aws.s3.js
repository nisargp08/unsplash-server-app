import fs from 'fs';

require('dotenv').config();

const S3 = require('aws-sdk/clients/s3');

// Variables
const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  bucketRegion,
  accessKey,
  secretKey,
});

// Upload a file to S3
function uploadFileToS3(file) {
  // Read the content of the passed file using filestream
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename.split('.')[0],
    ContentType: file.mimetype,
  };

  return s3.upload(uploadParams).promise();
}
// Download a file from S3
export default uploadFileToS3;
