import mongoose from 'mongoose'

const optionSchema = new mongoose.Schema({
    description: String,
    votes: Number,
})

optionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

export default optionSchema