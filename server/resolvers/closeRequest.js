module.exports = (_, { _id }, { requests, timeouts }) => {
  const index = requests.findIndex((request) => request._id === _id);
  if (index === -1) {
    throw new Error("Request not found!");
  }
  clearInterval(timeouts[_id]);
  delete timeouts[_id];

  requests[index] = { ...requests[index], status: "closed" };
  return requests[index];
};
