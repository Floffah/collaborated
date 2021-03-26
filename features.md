# Features
this is a list of features that are either planned or implemented and not stable yet

This document isnt finished and constantly expanding.

**Please remember** that not all changes or features that extend upon existing things are here. Please check issues under the "todo" label for automatically collected todo comments.

This list is prefixed by (f), (b), (s), (i), or (a) which mean frontend, backend, stored, interact, or app (each package) also see 1, 2, or 3 next to these which indicates the importance - 1 being not important, 3 being very important.

 - [ ] (f3) [Project "Drawer"](#project-drawer)
 - [ ] (b2) ["Adaptive" Rate Limiting](#adaptive-rate-limiting)
 - [ ] (b1) [Better inter-process system](#better-inter-process-system)

Unsorted & undescribed features/"almost full feature changes":

 - (f2) Better and more efficient popup utilities
 - (f1) Better icon system (but still using MDI)
 - (f2) Twemoji support (in all user editable text apart from things like usernames)
 - (f,b,i-3) Support multiple queries in one request or gateway message (eventually with a way to pipe output to the next query)
 - (b3) server side rendering (with styled-components)
 - (f3) mobile support

## Project Drawer
I have a vision of the ui of the project list where it is a vertical thin bar on the right which can be expanded by an mdi icon. The reason i want it to be on the right is because it feels more natural i think since to people who are right handed it will feel more natural and "at their fingertips". Eventually there will also be a left-handed mode which should have support for at the start but not have much functionality beyond this until suggestions are received.
The reason i call it the project "drawer" is just because of the fact it will feel natural and when clicking on one of the circles or "handle"/"knobs"s it will pull out giving more information in a drawer style.

## "Adaptive" Rate Limiting
Currently, or if i ended up adding it already, rate limiting is based on [fastify-rate-limit](https://github.com/fastify/fastify-rate-limit) which is just an if x amount of requests are sent in x amount of time. I feel like this might be very annoying to developer using the api so i thought of another way.
The reason i call it "adaptive" is because it isnt a fixed rate limit. In my head this is how it should work: record how many requests are coming from an ip every 1-5 seconds (or whatever people think makes more sense) then allow some requests but not all (e.g. 1 in every 5 requests depending on how many were sent are received) however if its above a threshold just dont let any in. While that is happening it should check the ip range and if its coming from the same range (e.g. 123.456.xxx.xxx), but i feel like it should be the first 3 sets instead of 2 just because if loads of people end up using it that might get messy. This is to prevent some ddos attacks. If this gets to the point that all requests from a range of for example 123.456.789.xxx (or something like that) then all requests shouldn't be blocked but should just automatically send no response body, but the status code [418](https://github.com/fastify/fastify-rate-limit) because that's hilarious

## Better inter-process system
Just in case you are unaware, what i call the inter-process system is basically just a system for instances of this server to communicate with all other running instances since eventually if collaborated gets big enough i want to run multiple instances for different regions but that is far away so just multiple instances in different parts of the same country to lighten the load on a single server

Currently although this is basically implemented it is not used and uses a central redis server. I want this to have a better system for broadcasting internal data to other servers (for example a message saying im going down for maintenance you might take all of my load beware) that may or may not use redis im not sure what is fastest for this scenario
