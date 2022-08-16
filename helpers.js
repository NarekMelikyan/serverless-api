const collectFilterExpression = (params) => {
    let arr = [];
    let str = '';
    for (const key of Object.keys(params)) {
        arr.push(`#${key} = :${key}`)
    }

    arr.forEach(i => {
        if (i === arr[arr.length - 1]) {
            str += ` ${i}`
        } else {
            str += ` ${i} AND`
        }
    })

    return str;
}

const collectExpressionAttributeNames = (params) => {
    let obj = {};
    for (const key of Object.keys(params)) {
        obj[`#${key}`] = key
    }

    return obj;
}

const collectExpressionAttributeValues = (params) => {
    let obj = {};
    for (const [key,value] of Object.entries(params)) {
        obj[`:${key}`] = value
    }

    return obj;
}

module.exports = {
    collectFilterExpression,
    collectExpressionAttributeNames,
    collectExpressionAttributeValues
}