'use client'

import { useEffect, useState } from "react"
import useInterval from "@/app/hooks/useInterval"

export default () => {
    const [timeleft,setTimeleft] = useState(null)
    const interval = useInterval()
    
    const toStrWZeroAdded = (n) => n>9 ? n.toString() : "0" + n.toString()

    const update = (date) => {
        const now = Date.now()
        if(date.valueOf()<=now) {
            setTimeleft("Voting is closed.")
            interval.clear()
        }
        else {
            let diff = date.valueOf()-now
            const hours = Math.floor(diff / 1000 / 60 / 60)
            diff -= hours * 1000 * 60 * 60
            const minutes = Math.floor(diff / 1000 / 60)
            diff -= minutes * 1000 * 60
            const seconds = Math.floor(diff / 1000)
            setTimeleft("Voting closes in " + hours + ":" + toStrWZeroAdded(minutes) + ":" + toStrWZeroAdded(seconds))
        }
    }

    const initialise = (d) => {
        update(d)
        interval.set(() => update(d),500)
    }

    return { initialise, timeleft }

}