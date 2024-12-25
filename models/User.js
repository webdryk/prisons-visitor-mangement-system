const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fName:{ type: String, required: true },
  lName:{ type: String, required: true },
  contact:{ type: Number, required: true },
  email: { type: String, required: true, unique: true },
  digitalAddress:{ type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'User'], default: 'User' },
  ID:{ type: String, required: true, unique: true },
  Address:{ type: String, required: true },

  booking:[{
    fNameInmate:{ type: String, required: true },
    lNameInmate:{ type: String, required: true },
    sentanceyear:{ type: String, required: true },
    crime:{ type: String, required: true },
    items:{ type: String },
    additionalInfo:{ type: String },
    bookDate:{ type: Date ,required: true },
    appointmentDate:{ type: String,required: true },
    status:{ type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }

  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
