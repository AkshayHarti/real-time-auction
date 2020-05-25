module.exports = (
  _,
  { _id },
  { requests, proposals, timeouts, pubsub, agenda, constants }
) => {
  const proposal = proposals.find((proposal) => proposal._id === _id);
  if (!proposal) {
    throw new Error("Proposal not found!");
  }
  const requestIndex = requests.findIndex(
    (request) => request._id === proposal.requestId
  );

  const dueDate = new Date(
    new Date(requests[requestIndex].dueDate).getTime() + 60000
  ).toISOString();

  clearTimeout(timeouts[requests[requestIndex]._id]);
  timeouts[requests[requestIndex]._id] = agenda({
    _id: requests[requestIndex]._id,
    dueDate,
    index: requestIndex,
    requests,
    timeouts,
  });

  pubsub.publish(constants.REQUEST_EVENT, {
    requestEvent: { ...requests[requestIndex], event: "REQUEST_EXTENDED" },
  });

  requests[requestIndex] = { ...requests[requestIndex], dueDate };
  return `Request due date is after ${(
    (new Date(dueDate) - new Date()) /
    60000
  ).toFixed(2)} minutes`;
};
