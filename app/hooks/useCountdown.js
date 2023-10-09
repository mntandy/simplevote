'use client'

import { useState } from "react"
import useInterval from "@/app/hooks/useInterval"
import { getUserText } from "../lib/styles"

const useCountdown = ({ organiser }) => {
    const [timeleft, setTimeleft] = useState(null)
    const interval = useInterval()
    const [expired, setExpired] = useState(null)
    const toStrWZeroAdded = (n) => n > 9 ? n.toString() : "0" + n.toString()

    const update = (date) => {
        const now = Date.now()
        if (date.valueOf() <= now) {
            setTimeleft(getUserText(organiser, "votingClosed"))
            interval.clear()
            setExpired(true)
        }
        else {
            let diff = date.valueOf() - now
            const hours = Math.floor(diff / 1000 / 60 / 60)
            diff -= hours * 1000 * 60 * 60
            const minutes = Math.floor(diff / 1000 / 60)
            diff -= minutes * 1000 * 60
            const seconds = Math.floor(diff / 1000)
            setTimeleft(getUserText(organiser,"voteCloses") + hours + ":" + toStrWZeroAdded(minutes) + ":" + toStrWZeroAdded(seconds))
        }
    }

    const initialiseCountdown = (expiration) => {
        if (!timeleft && !expired && expiration) {
            const d = new Date(expiration)
            update(d)
            interval.set(() => update(d), 500)
        }
    }

    return { timeleft, initialiseCountdown }

}

export default useCountdown