
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(req.params.id)
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const fileExtension = file.originalname.substr(file.originalname.lastIndexOf('.')+1,file.originalname.length);
      cb(null, `${req.params.id}.${fileExtension}`)
    }
  })
 
  const fileFilter=(req, file, cb)=>{
   if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
       cb(null,true);
   }else{
       cb(null, false);
   }
 
  }
 
const upload = multer({ 
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter:fileFilter
 });

module.exports = upload;