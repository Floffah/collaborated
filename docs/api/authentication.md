# Authentication

Authentication is pretty simple. You provide a username and password (or api token) and you are given an access and refresh key. an access key is made invalid 10 minutes after you last make a connection however you can request a new access key with your refresh key.

To authenticate, it would look something like this

```graphql
query Authenticate($email: String!, $password: String!) {
    authenticate(email: $email, password: $password) {
        access
        refresh
    }
}
```

Once you have an access key, you must provide it in the `access` header. The `access` header should not contain anything but the access (no prefix).

An example client implementation for the api can be seen [here](../../packages/interact/src/core/Client.ts) and [here](../../packages/interact/src/api/API.ts).
