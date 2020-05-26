import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useParams } from "react-router-dom";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import useForceUpdate from "../../hooks/forceUpdate";
import isAfter from "date-fns/isAfter";

const divStyle = {
  margin: "20px",
};

const DueDate = ({ dueDate }) => {
  const forceUpdate = useForceUpdate();

  setTimeout(() => {
    forceUpdate();
  }, 1000);

  return isAfter(new Date(), new Date(dueDate)) ? (
    <span style={{ color: "red" }}>Waiting for confirmation</span>
  ) : (
    <span>
      {formatDistanceToNowStrict(new Date(dueDate), { addSuffix: true })}
    </span>
  );
};

const ViewRequest = ({ requestId, dueDate, status, subscribe }) => {
  React.useEffect(() => {
    subscribe();
  }, []);

  console.log("Rendering");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={divStyle}>
        RequestId: <span>{requestId}</span>
      </div>
      {status !== "closed" && (
        <div style={divStyle}>
          Due date:&nbsp;
          <DueDate dueDate={dueDate} />
        </div>
      )}
      <div style={divStyle}>
        Status: <span>{status}</span>
      </div>
    </div>
  );
};

const GET_REQUEST = gql`
  query getRequest($_id: ID!) {
    getRequest(_id: $_id) {
      _id
      dueDate
      status
    }
  }
`;

const REQUEST_EVENT_SUBSCRIPTION = gql`
  subscription requestEvent($_id: ID!) {
    requestEvent(_id: $_id) {
      _id
      dueDate
      status
      event
    }
  }
`;
export default () => {
  const { id } = useParams();
  const { loading, error, data, subscribeToMore } = useQuery(GET_REQUEST, {
    variables: { _id: id },
  });
  console.log({ data });
  if (loading) {
    return "Loading...";
  }

  if (error) {
    console.error("Error!!");
  }

  const { _id: requestId, dueDate, status } = data.getRequest;
  return (
    <ViewRequest
      subscribe={() =>
        subscribeToMore({
          document: REQUEST_EVENT_SUBSCRIPTION,
          variables: { _id: requestId },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }
            console.log({ prev, subscriptionData });
            return Object.assign({}, prev, {
              ...subscriptionData.data.requestEvent,
            });
          },
        })
      }
      requestId={requestId}
      dueDate={dueDate}
      status={status}
    />
  );
};
