module.exports = (_, { _id }, { requests, timeouts, pubsub, constants }) => {
  const index = requests.findIndex((request) => request._id === _id);
  if (index === -1) {
    throw new Error("Request not found!");
  }
  clearInterval(timeouts[_id]);
  delete timeouts[_id];

  requests[index] = {
    ...requests[index],
    status: "closed",
  };

  pubsub.publish(constants.REQUEST_EVENT, {
    requestEvent: { ...requests[index], event: "REQUEST_CLOSED" },
  });

  return requests[index];
};
