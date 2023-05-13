const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength:[3, 'Minimum name length is 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Minimum password length is 6 characters']
  },
  role :{
    type:String,
    default:'manager'
  }
});
// Password Hashing 

customerSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });











const Manager = mongoose.model('Manager', managerSchema);

module.exports = {
  Manager,

  // View all technicians
  viewTechnicians: function (callback) {
    Technician.find({}, function (err, technicians) {
      if (err) {
        callback(err);
      } else {
        callback(null, technicians);
      }
    });
  },

  // View all tickets
  viewTickets: function (callback) {
    Ticket.find({}, function (err, tickets) {
      if (err) {
        callback(err);
      } else {
        callback(null, tickets);
      }
    });
  },

  // Approve a ticket
  approveTicket: function (ticketId, callback) {
    Ticket.findByIdAndUpdate(ticketId, { status: 'Approved' }, function (err, ticket) {
      if (err) {
        callback(err);
      } else {
        callback(null, ticket);
      }
    });
  },

  // Refuse a ticket
  refuseTicket: function (ticketId, callback) {
    Ticket.findByIdAndUpdate(ticketId, { status: 'Refused' }, function (err, ticket) {
      if (err) {
        callback(err);
      } else {
        callback(null, ticket);
      }
    });
  },

  // Assign a ticket to a technician
  assignTicket: function (ticketId, technicianId, callback) {
    Ticket.findByIdAndUpdate(ticketId, { technician: technicianId }, function (err, ticket) {
      if (err) {
        callback(err);
      } else {
        callback(null, ticket);
      }
    });
  },

  // View ticket reports
  viewReports: function (callback) {
    Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ], function (err, results) {
      if (err) {
        callback(err);
      } else {
        callback(null, results);
      }
    });
  }
};
