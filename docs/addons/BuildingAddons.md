This is currently just an idea you can't do a lot of this yet.

# Building Addons

Normally in other services, they have what is known as "bots". Although on the tin it looks like collaborated has bots
too, it is not the same. Collaborated is not a service that is exactly what it is. Collaborated can be changed to how
you like it. To do this, I had to come up with a new way for developers to create bots, extensions, themes, on
collaborated. So I started brainstorming "addons". Addons are a way for developers to create services that interact with
users in a new way while still staying secure.

## Help

 - I keep getting an unknown error while connecting to the subscription websocket
    - The cause of this is almost always that you forgot to set a valid authentication token in your connection params
    - Eventually, I will send a pull request to mercurius (graphql middleware) to properly work errors
