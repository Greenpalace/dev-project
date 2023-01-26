function validateSingleProp(e, min, max) {
    var eVal = parseInt(e.val())
    if (eVal == NaN || eVal < min || eVal == "")
    {
        eVal = min
    }
    else if (eVal > max)
    {
        eVal = max
    }
    e.val(eVal)
}

function validatePairProp(e, min, max, t, bigger=true) {
    validateSingleProp(e, min, max)
    if ((parseInt(e.val()) < parseInt(t.val())) == bigger)
    {
        t.val(e.val())
    }
}

function getKeyByValue(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value)
}