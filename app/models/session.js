import mongoose from 'mongoose'
import optionSchema from '@/app/models/option'

const sessionSchema = new mongoose.Schema({
    description: String,
    duration: String,
    maxVotes: String,
    key: String,
    protected: Boolean,
    expiration: Date,
    options: [optionSchema], 
})

sessionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

export default sessionSchema
//module.exports = mongoose.models.Vote || mongoose.model('Vote', voteSchema)