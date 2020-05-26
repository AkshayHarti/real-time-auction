module.exports = (pubsub, constants) => ({
  _id,
  dueDate,
  index,
  requests,
  timeouts,
}) =>
  setTimeout(() => {
    clearTimeout(timeouts[_id]);
    delete timeouts[_id];
    requests[index].status = "closed";
    pubsub.publish(constants.REQUEST_EVENT, {
      requestEvent: { ...requests[index], event: "REQUEST_CLOSED" },
    });
  }, new Date(dueDate) - new Date() + 5000);
