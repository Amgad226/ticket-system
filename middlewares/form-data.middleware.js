const {upload} =require('../multer')

const handleSendByFormData = (req, res, next) => {
    
      upload.none()(req, res, (err) => {
        if (err) {
          // Handle the Multer error when receiving empty key-value pair
          return res.json({error :err.message});
        }
        next();
      });
    
  };

module.exports={handleSendByFormData}