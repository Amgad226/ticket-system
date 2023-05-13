class CustomError extends Error{
    constructor(message , statusCode )
    {
        super(message);
        this.statusCode=statusCode;
    }
}
const createCostumeError= (msg ,statusCode)=>{
    return new CustomError(msg,statusCode);
}
module.exports={
    createCostumeError,
    CustomError
}