import { display } from "@/app/components/Message"

export const tryAndCatch = async (func,...params) => {
    try {
        const result = await func(...params)
        return result
    }
    catch (err) {
        display(err.message)
    }
    return null
}