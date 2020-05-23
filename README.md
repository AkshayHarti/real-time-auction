# real-time-auction

## This project currently just has a gql server

#### Start server
`npm start`

**Queries**

1. __GET REQUESTS__
```
{
  getRequests {
    _id
    dueDate
    status
  }
}
```
---
**Mutations**

1. __ADD REQUEST__
```
mutation addRequest {
  addRequest(dueDate: "2020-05-23T03:15:20.916Z", status: "finalized")
}
```
Generate `dueDate` e.g. `new Date(Date.now() + 60000).toISOString()`

2. __UPDATE REQUEST__
```
mutation updateRequest {
  updateRequest(_id: "d315e374-4e79-45f3-a15c-dd90bb132257") {
    _id
    dueDate
    status
  }
}
```
Put an `_id` of a one of the requests. You can see all requests by running `getRequests` query.

---
**Subscriptions**
1. __TIMER PASSED__
```
subscription timerPassed {
  timerPassed {
    _id
    dueDate
    status
  }
}
```

2. __TIMER UPDATED__
```
subscription timerUpdated {
  timerUpdated {
    _id
    dueDate
    status
  }
}
```
