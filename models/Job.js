const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      minLength: 2,
      maxLength: 25,
    },

    position: {
      type: String,
      required: [true, 'Please provide the position'],
    },

    status: {
      type: String,
      default: 'pending',
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Please provide the user'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('jobs', jobSchema)
