const options = {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

module.exports = {
  formatDate: function(date) {
    if (!date) return;
    return date.toLocaleDateString(undefined, options);
  },
  formatPoints: function(points) {
    return points.toFixed(0);
  },
};
