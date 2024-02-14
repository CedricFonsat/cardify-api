import multer from 'multer';

const storageAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/assets/upload/avatar/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

export const uploadAvatar = multer({ storage: storageAvatar });