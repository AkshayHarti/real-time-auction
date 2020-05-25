const uuid = require("uuid");

module.exports = (
  _,
  { dueDate, status },
  { requests, timeouts, agenda, pubsub, constants }
) => {
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

  pubsub.publish(constants.REQUEST_EVENT, {
    requestEvent: { ...requests[index], event: "REQUEST_SUBMITTED" },
  });

  return requests[index];
};
