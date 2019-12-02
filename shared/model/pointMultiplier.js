const numberOfMembers = 5;

pointMultiplier =
  numberOfMembers /
  taskList.reduce((sum, task) => {
    return sum + task.effort / task.frequency;
  }, 0);
