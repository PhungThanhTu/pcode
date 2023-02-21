exports.addDays = (date, days) => {
    const res = date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    return res;
  }