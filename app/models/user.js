import mongoose from 'mongoose'
import sessionSchema from '@/app/models/session'

const userSchema = new mongoose.Schema({
    email: String,
    passwordHash: String,
    nickname: String,
    sessions: [sessionSchema]
  }, {timestamps: true})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.passwordHash
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.models.User || mongoose.model('User', userSchema)