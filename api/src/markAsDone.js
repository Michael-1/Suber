const { Datastore } = require("@google-cloud/datastore");
const param = require("../../shared/param");
const { Task } = require("../../shared/model/Task");

const datastore = new Datastore();

module.exports = async function markAsDone(req, res) {
  const currentTime = new Date();
  const transaction = datastore.transaction();
  const taskKey = datastore.key([param.DATABASE_KIND.TASK, req.params.key]);
  try {
    await transaction.run();
    const [taskData] = await transaction.get(taskKey);
    const task = new Task(taskData, currentTime);
    taskData.lastDone = currentTime;
    transaction.save([
      {
        key: taskKey,
        data: taskData
      }
    ]);
    transaction.commit();
  } catch (e) {
    transaction.rollback();
  }
};
