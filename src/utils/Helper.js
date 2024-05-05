const isBase64 = require('is-base64');
const { getImageMime } = require('base64-image-mime');
// const fileService = require('../services/files.service');

const paginationSize = 10;

// const base64Decode = (base64Image) => {
//   const base64 = base64Image.replace(/^data:image\/\w+;base64,/, '');
//   if (isBase64(base64)) {
//     return Buffer.from(base64, 'base64');
//   }
//   return false;
// };

// const base64MimeType = (base64Image) => {
//   const base64 = base64Image.replace(/^data:image\/\w+;base64,/, '');
//   if (isBase64(base64)) {
//     const mimeType = getImageMime(base64Image);
//     console.log('mimeType', mimeType);
//     return mimeType;
//   }
//   return false;
// };

// const fileUpload = async (encodedFile, path) => {
//   const base64 = base64Decode(encodedFile);
//   const mime = base64MimeType(encodedFile);
//   if (base64 && mime) {
//     return fileService.uploadFile(base64, path, mime);
//   }
//   return false;
// };

// const fileDelete = async (path) => {
//   return fileService.deleteFile(path);
// };

// const getFile = async (path) => {
//   const file = await fileService.getFile(path).catch(() => {
//     return false;
//   });
//   if (file) {
//     const buf = Buffer.from(file.Body);
//     return `data:${file.ContentType};base64,${buf.toString('base64')}`;
//   }
//   return false;
// };

const apiResponse = (code, message, data = null) => {
  return {
    code,
    message,
    data,
  };
};



module.exports = {
  // base64Decode,
  // base64MimeType,
  // getFile,
  // fileUpload,
  // fileDelete,
  paginationSize,
  apiResponse,
};
