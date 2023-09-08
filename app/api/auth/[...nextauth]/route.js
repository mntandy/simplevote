require('dotenv').config()
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from '@/app/lib/dbConnect'
import User from '@/app/models/user'
import bcrypt from 'bcrypt'

const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials
                await dbConnect()

                const user = await User.findOne({ email })
                const passwordCorrect = user === null 
                    ? false
                    : await bcrypt.compare(password, user.passwordHash)

                if (!user || !passwordCorrect)
                    return null
                return user
            }
        })
    ],
    callbacks: {
        async jwt({token,user}){
            if(user){
                token.id = user._id
                token.nickname = user.nickname
            }
            return token
        },
        async session({ session, token}) {
          session.user = {nickname: token.nickname, id: token.id }        
          return session
        }
    }
}
    

const handler = NextAuth(authOptions)

export { authOptions, handler as GET, handler as POST }