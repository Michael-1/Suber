const pointMultiplier = 1;

module.exports = function(task, currentTime) {
  Object.assign(this, task);
  const now = currentTime ? currentTime.getTime() : Date.now();
  this.lastDone = new Date(task.lastDone);
  this.urgency =
    (now - this.lastDone.getTime()) / (task.frequency * (1000 * 60 * 60 * 24));
  this.points = pointMultiplier * task.effort * this.urgency;
};
