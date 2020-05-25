module.exports = (
  _,
  { _id, dueDate },
  { requests, timeouts, agenda, pubsub, constants }
) => {
  const index = requests.findIndex((request) => request._id === _id);
  requests[index].dueDate = dueDate;
  requests[index].status = "finalized";

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
