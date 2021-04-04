This is currently just an idea you can't do a lot of this yet.

# Building Addons

Normally in other services, they have what is known as "bots". Although on the tin it looks like collaborated has bots too, it is not the same.
Collaborated is not a service that is exactly what it is. Collaborated can be changed to how you like it.
To do this, I had to come up with a new way for developers to create bots, extensions, themes, on collaborated.
So I started brainstorming "addons". Addons are a way for developers to create services that interact with users in a new way.

## What can addons do?

1. Show content to users using:
 - popups
 - page-channels
 - embedded messages
2. Get input from users using:
 - input boxes and buttons in popups
 - pages with inputs boxes, buttons, etc
 - input boxes and buttons in embedded messages
3. Make each user's experience unique by:
 - storing data on Collaborated's containerised servers and using that to display information to the user
 - using per-user embedded messages

## How do I make addons?
Making addons is easy with our interact library. If you are using nodejs/typescript, you can install `@collaborated/interact`. This package also works in the browser but you must enable that in the options or you will run into issues.
Currently there are no other known libraries in different languages, feel free to make one! (You can read the api docs in the developer dashboard within collaborated or use the graphiql page's docs to see available endpoints.)

To understand how to use the nodejs/typescript interact library, you can view docs on it's npm page. It also has type definitions shipped with it to help understand it.