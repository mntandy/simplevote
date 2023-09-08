import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const getAuthSession = async () => await getServerSession(authOptions)
    