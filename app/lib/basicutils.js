
export const containsArray = (object,key) => (typeof object === "object") && key in object && Array.isArray(object[key])

export const containsNonEmptyArray = (object,key) => containsArray(object,key) && !!object[key].length

export const isNonEmptyArray = (arr) => Array.isArray(arr) && !!arr.length