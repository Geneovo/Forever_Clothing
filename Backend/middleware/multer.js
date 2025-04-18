import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('File upload initiated');
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    console.log('Saving file:', file.originalname);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
}

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
 });
export default upload;
