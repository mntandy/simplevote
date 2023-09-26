
const hasStyle = (s) => ["jammin"].includes(s)

export const getClasses = ({ organiser, classes }) =>
    (hasStyle(organiser)) ?
        classes.split(' ').map(e => `${organiser}-${e}`).join(" ")
        : classes