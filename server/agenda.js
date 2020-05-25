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
    pubsub.publish(constants.TIMER_PASSED, {
      timerPassed: requests[index],
    });
  }, new Date(dueDate) - new Date());
