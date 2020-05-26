import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const SUBMIT_REQUEST = gql`
  mutation submitRequest($_id: ID!, $dueDate: String!) {
    submitRequest(_id: $_id, dueDate: $dueDate) {
      _id
      dueDate
      status
    }
  }
`;

const ClientForm = () => {
  const [dueDate, setDueDate] = React.useState("");
  const [submitRequest, { loading, error }] = useMutation(SUBMIT_REQUEST);
  const { id } = useParams();
  const history = useHistory();

  if (loading) {
    return "Loading...";
  }

  if (error) {
    console.log("Error!!");
  }

  const handleChange = (e) => {
    e.persist();
    setDueDate(e.target.value);
  };

  const handleSubmit = async () => {
    const {
      data: {
        submitRequest: { _id },
      },
    } = await submitRequest({
      variables: { _id: id, dueDate: new Date(dueDate).toISOString() },
    });

    history.push(`/client/${_id}/view-request`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="datetime-local"
        id="due-date"
        name="dueDate"
        value={dueDate}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ClientForm;
