module.exports.nameToField = (name, upper) => {

	let tmp = name.trim().split(' ');

	if (upper)
		tmp[0] = tmp[0].charAt(0).toUpperCase() + tmp[0].substring(1)
	else
		tmp[0] = tmp[0].toLowerCase();

	return tmp.join('');
};

const toCamel = function (o) {
    var newO, origKey, newKey, value
    if (o instanceof Array) {
      return o.map(function(value) {
          if (typeof value === "object") {
            value = toCamel(value)
          }
          return value
      })
    } else {
      newO = {}
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
          value = o[origKey]
          if (value instanceof Array || (value !== null && value.constructor === Object)) {
            value = toCamel(value)
          }
          newO[newKey] = value
        }
      }
    }
    return newO
  }

module.exports.toCamel = toCamel