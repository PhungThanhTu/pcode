String.prototype.replaceAll = function (pattern, replace) {
    const parts = this.split(pattern);
    const output = parts.join(replace);
    return output;
}

module.exports.replaceAll = String.prototype.replaceAll;
