
# Moment

## Overview

Sometimes, we just want to spontaneously meet up with the people we love and haven't seen in a while. Sometimes, we don't have a consistent schedule and want to see what everyone's day is like in a consolidated form, rather than scrolling through dispersed messages in a group chat or creating an entire spreadsheet just for one meetup.

"Moments" is a web app tailored for groups of people to list their availability. Users can register and login. Once they're logged in, they can create a group. Users can then add, edit, or delete an entry. The same group can be reused for future planning, so that there is no hassle to recreate or keep track of new events with the same people.

## Data Model

The application will store Users, Groups, and Members.

* users can have multiple Groups (via references)
* each Group can have multiple Members

An Example User:

```javascript
{
  username: "weewoouser",
  hash: // a password hash,
  groups: // an array of references to Group documents,
}
```

An Example Group with Members:

```javascript
{
  id: //generated unique identifer
  name: "the girls",
  members: [
    { name: "Person A", date: "10/26/2021-10/28/2021", time: "8:00AM-12:00PM"},
    { name: "Person B", date: "10/27/2021", time: "anytime after 10:00AM"},
    { name: "Person C", date: "10/28/2021", time: "9:00AM-10:00AM, and after 11:00AM works for me!"}
  ],
}
```

## Wireframe

![prototype](https://cdn.discordapp.com/attachments/86483011788353536/933453617212567602/chrome_2022-01-19_15-09-44.gif)

Alternatively, [view the clickable prototype for yourself](https://xd.adobe.com/view/0749fdd1-7c21-45da-b108-62c7dc18bac2-521a/) (currently in progress)

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can view all of the groups I'm involved in
4. as a user, I can create a new group
5. as a user, I can edit an entry in an existing group
6. as a user, I can delete an existing entry
7. as a user, I can invite other registered users to a group

