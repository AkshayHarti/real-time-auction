import React from "react";
import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const CREATE_REQUEST = gql`
  mutation createRequest {
    createRequest
  }
`;

const Client = () => {
  const history = useHistory();
  const [createRequest, { error, loading }] = useMutation(CREATE_REQUEST);

  if (loading) {
    return "Loading...";
  }

  if (error) {
    console.log("Error!!");
  }

  const handleClick = async () => {
    const {
      data: { createRequest: requestId },
    } = await createRequest();
    history.push(`/client/${requestId}`);
  };

  return <button onClick={handleClick}>Create Proposal</button>;
};

export default Client;
