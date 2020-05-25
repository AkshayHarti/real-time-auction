const uuid = require("uuid");

module.exports = (
  _,
  { requestId, status },
  { requests, proposals, timeouts, pubsub, constants, agenda }
) => {
  const _id = uuid.v4();
  const index = requests.findIndex((request) => request._id === requestId);
  if (index === -1) {
    throw new Error("Request not present");
  }
  const currentProposal = { _id, requestId, status };
  proposals.push(currentProposal);

  const dueDate = new Date(
    new Date(requests[index].dueDate).getTime() + 60000
  ).toISOString();

  clearTimeout(timeouts[requests[index]._id]);
  timeouts[requests[index]._id] = agenda({
    _id: requests[index]._id,
    dueDate,
    index,
    requests,
    timeouts,
  });

  pubsub.publish(constants.TIMER_UPDATED, {
    timerUpdated: requests[index],
  });

  requests[index] = { ...requests[index], dueDate };
  return currentProposal;
};
