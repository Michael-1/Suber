module.exports = class Task {
  constructor(task) {
    Object.assign(this, task);
    this.lastDone = new Date(task.lastDone);
  }
  get urgency() {
    return (
      (Date.now() - this.lastDone.getTime()) /
      (this.frequency * (1000 * 60 * 60 * 24))
    );
  }
  get points() {
    return this.effort * this.urgency;
  }
};
