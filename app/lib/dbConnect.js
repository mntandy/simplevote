require('dotenv').config()
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  )
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

const dbConnect = async () => {
    if (cached.conn)
      return cached.conn
  
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {bufferCommands: false,})
          .then(mongoose => mongoose)
    }
  
    try {
        cached.conn = await cached.promise
    } catch (err) {
        cached.promise = null
        throw err
    }
  
    return cached.conn
}
  
export default dbConnect

