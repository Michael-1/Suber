module.exports = function(number, precision) {
  if (number >= 0) return number.toFixed(2);
  return "−" + (-number).toFixed(2);
};
