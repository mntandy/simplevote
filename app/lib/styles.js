import Users from '@/app/json/users'

const hasStyle = (s) => ["test","jammin"].includes(s)

const getOrganiser = (s) => s==="test" ? "jammin" : s

const withStyle = (s) => hasStyle(s) ? getOrganiser(s) : "standard"

export const getClasses = (organiser, classes) =>
    classes.split(' ').flatMap(e => ([`common-${e}`,`${withStyle(organiser)}-${e}`])).join(" ")

export const getLogo = (organiser) => getOrganiser(organiser) in Users ? "/" + getOrganiser(organiser) + ".jpg" : "/vote.png"

export const getLogoLink = (organiser) => organiser in Users ? Users[organiser]['logoLink'] : "/" + organiser

export const getUserText = (organiser,text) => Users[getOrganiser(organiser) in Users ? getOrganiser(organiser) : "standard"][text] 
