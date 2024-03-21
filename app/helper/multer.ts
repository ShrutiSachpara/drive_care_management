import { diskStorage } from 'multer';
import { extname } from 'path';

export const storage = diskStorage({
  destination: '../../public/uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + extname(file.originalname));
  },
});
