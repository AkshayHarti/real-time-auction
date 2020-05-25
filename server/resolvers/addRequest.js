const uuid = require("uuid");

module.exports = (_, { dueDate, status }, { requests, timeouts, agenda }) => {
  const _id = uuid.v4();
  requests.push({ _id, dueDate, status });
  const index = requests.length - 1;
  timeouts[_id] = agenda({
    _id,
    dueDate,
    index,
    requests,
    timeouts,
  });
  return requests[index];
};
