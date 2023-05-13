const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema({
  phone :{
    type:String,
    required:[true,'Phone number not added'],
    unique:true,
    minlength:[10,'Minimum phone number length is 10 characters'],
    maxlength:[10,'Maximum phone number length is 10 characters'],
    validate: {
      validator: v=> {
        return /^09[3-9][0-9]+$/.test(v);
      },
      message: 'Invalid phone number.'
    }
  },
  password: {
    type: String,
    required: [true, 'Password not added'],
    minlength: [6, 'Minimum password length is 6 characters']
  },
  name:{
    type:String,
    required:[true,'Name not added'],
    minlength:[3, 'Minimum name length is 3 characters']
  },
  role :{
    type:String,
    default:'Customer'
  },
  region:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Region', 
    required:[true,'Region not added']
  },
  street :{
    type : String,
    required : [true,'Street not added']
  },
  building :{
    type : String,
    required : [true,'Building not added']
  },
  floor :{
    type : String,
    required : [true,'Floor not added']
  },
  flat :{
    type : String,
    required : [true,'Flat not added']
  }
});

///////////////////////////////////////////////// Password Hashing //////////////////////////////////////////////
customerSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

///////////////////////////////////////////////// Login Method /////////////////////////////////////////////////
customerSchema.statics.logIn = async function(phone, password) {
  const customer = await this.findOne({ phone });
  if(customer){
    const auth = await bcrypt.compare(password, customer.password);
    if(auth){
      return customer;
    }
    throw Error("Incorrect password.");
  }
  throw Error("Incorrect phone number.");
};

module.exports = mongoose.model('Customer', customerSchema);