import Users from '@/app/json/users'

const hasStyle = (s) => ["jammin","test"].includes(s)

const getOrganiser = (s) => s==="test" ? "jammin" : s

const withStyle = (s) => hasStyle(s) ? getOrganiser(s) : "standard"

export const getClasses = (organiser, classes) =>
    classes.split(' ').flatMap(e => ([`${withStyle(organiser)}-${e}`,`common-${e}`])).join(" ")

export const getLogo = (organiser) => organiser in Users ? "/" + organiser + ".jpg" : "/jammin.jpg"

export const getLogoLink = (organiser) => organiser in Users ? Users[organiser]['logoLink'] : "/" + organiser

export const getUserText = (organiser,text) => Users[getOrganiser(organiser) in Users ? getOrganiser(organiser) : "standard"][text] 
