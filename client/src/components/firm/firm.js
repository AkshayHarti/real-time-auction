import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import styled from "styled-components";

const GET_DATA = gql`
  query getRequests {
    requests: getOpenRequests {
      _id
    }

    proposals: getProposals {
      _id
      requestId
    }
  }
`;

const ADD_PROPOSAL = gql`
  mutation addProposal($requestId: ID!, $status: String!) {
    addProposal(requestId: $requestId, status: $status) {
      _id
      requestId
      status
    }
  }
`;

const UPDATE_PROPOSAL = gql`
  mutation updateProposal($_id: ID!) {
    updateProposal(_id: $_id)
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  & > * {
    margin: 10px 0;
  }
`;

const StyledTH = styled.th`
  border: 1px solid #dddddd;
`;

const StyledTD = styled.td`
  border: 1px solid #dddddd;
`;

const Firm = () => {
  const [requestId, setRequestId] = React.useState("");
  const [proposalId, setProposalId] = React.useState("");
  const { data, loading } = useQuery(GET_DATA);
  const [addProposal] = useMutation(ADD_PROPOSAL);
  const [updateProposal] = useMutation(UPDATE_PROPOSAL);

  if (loading) {
    return "Loading...";
  }

  const handleOnAddProposal = async () => {
    await addProposal({ variables: { requestId, status: "finalized" } });
  };

  const handleOnUpdateProposal = async () => {
    await updateProposal({ variables: { _id: proposalId } });
  };

  return (
    <table cellPadding={5} cellSpacing={10}>
      <tr>
        <StyledTH>Open Requests</StyledTH>
        <StyledTH>Proposals</StyledTH>
        <StyledTH></StyledTH>
        <StyledTH></StyledTH>
      </tr>
      <tr>
        <StyledTD>
          <ol>
            {data.requests.map((request) => (
              <li key={request._id}>{request._id}</li>
            ))}
          </ol>
        </StyledTD>
        <StyledTD>
          <ol>
            {data.proposals.map((proposal) => (
              <li key={proposal._id}>
                <div>
                  <b>proposal:</b> {proposal._id}
                </div>
                <div>
                  <b>request:</b> {proposal.requestId}
                </div>
              </li>
            ))}
          </ol>
        </StyledTD>
        <StyledTD>
          <StyledForm>
            <label for="requestId">requestId:</label>
            <input
              type="text"
              name="requestId"
              id="requestId"
              value={requestId}
              onChange={(e) => {
                e.persist();
                setRequestId(e.target.value);
              }}
            />
            <button type="submit" onClick={handleOnAddProposal}>
              Submit proposal
            </button>
          </StyledForm>
        </StyledTD>
        <StyledTD>
          <StyledForm>
            <label for="proposalId">proposalId:</label>
            <input
              type="text"
              name="proposalId"
              id="proposalId"
              value={proposalId}
              onChange={(e) => {
                e.persist();
                setProposalId(e.target.value);
              }}
            />
            <button type="submit" onClick={handleOnUpdateProposal}>
              Update proposal
            </button>
          </StyledForm>
        </StyledTD>
      </tr>
    </table>
  );
};

export default Firm;

{
  /* <div>
      <div>
        <div>
          <ol>
            {data.requests.map((requestId) => (
              <li key={requestId}>{requestId}</li>
            ))}
          </ol>
        </div>
        <div>
          <ol>
            {data.proposals.map((proposal) => (
              <li key={proposal._id}>
                <div>{proposal._id}</div>
                <div>{proposal.requestId}</div>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <form>
            requestId:
            <input type="text" name="requestId" value="" />
            <button type="submit">Submit proposal</button>
          </form>
        </div>
        <div>
          <form>
            proposalId:
            <input type="text" name="proposalId" value="" />
            requestId:
            <input type="text" name="requestId" value="" />
            <button type="submit">Submit proposal</button>
          </form>
        </div>
      </div>
    </div> */
}
