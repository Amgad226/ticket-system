const {upload} =require('../multer')

// to allow send data inside form data and handle any error regarding send data 
const handleSendByFormData = (req, res, next) => {
    
      upload.none()(req, res, (err) => {
        if (err) {
          // Handle the Multer error when receiving empty key-value pair
          return res.status(400).json({error :err.message});
        }
        next();
      });
    
  };

module.exports={handleSendByFormData}