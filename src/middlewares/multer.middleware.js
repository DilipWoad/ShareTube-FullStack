import multer from "multer";


//here file will come from the client
//so we use multer to take the file and store it to server
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

export const upload = multer({ storage: storage })