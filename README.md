# real-time-auction
Real-time auction

__This project currently just includes a gql server__

**Start server**
`npm start`

**Queries**

1. GET REQUESTS
```
{
  getRequests {
    _id
    dueDate
    status
  }
}
```

**Mutations**

1. ADD REQUEST
`
mutation addRequest {
  addRequest(dueDate: "2020-05-23T03:15:20.916Z", status: "finalized")
}
`
Generate `dueDate` as `new Date(Date.now() + 60000).toISOString()`

2. UPDATE REQUEST
`
mutation updateRequest {
  updateRequest(_id: "d315e374-4e79-45f3-a15c-dd90bb132257") {
    _id
    dueDate
    status
  }
}
`
Put an `_id` of a one of the requests. You can see all requests by running `getRequests` query.

**Subscriptions**
1. TIMER PASSED
`
subscription timerPassed {
  timerPassed {
    _id
    dueDate
    status
  }
}
`

2. TIMER UPDATED
`
subscription timerUpdated {
  timerUpdated {
    _id
    dueDate
    status
  }
}
`
