const uuid = require("uuid");

module.exports = (_, __, { requests }) => {
  const _id = uuid.v4();
  requests.push({ _id });
  return _id;
};
