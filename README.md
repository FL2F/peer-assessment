# This is a replacement project for Johari Window

#### If you want to chagne the traits that are displayed on the peer assessment test, go to the traitsArr.js in the helperFunctions folder in the frontend to make the adjustments.

Included with this repository is a video tutorial for the facilitator who is running the workshop

## To Do

<ul>
  <li>Change JWT storage from LocalStorage to HTTPOnly Cookie</li>
  <li> 
    make admin Dashboard show groups to select from, then navigate to the dashboard with that groupId
  </li>

  <li>
    figure a way to get all users for a specific group when an admin user is logged in. Currently it is getting group_id from the logged in user's group_id
  </li>

  <li>
    Fix JWT not being read properly after reloading the page
  </li>

  <li>Add Incomplete and completed tests heading on dashboard</li>

  <li>There is a bug that when I go to edit a test, the selected traits don't appear unless i reload</li>

- add Facilitator role for facilitators. Not as accessible as admin, but more than participant

---

  <li>We need a way to remove old traits Orly after each cohort so that the list doesn't get to long</li>
  <li>need to talk with Orly about if she wants the participants to input traits for the admin facilitator</li>
</ul>

## To do with admin group-select

<ul>
  <li>Make group select page display a list of different groups</li>
  <li>create function in backend for getting groups</li>
  <li>create function in backend to get members from group</li>
</ul>

## Notes and Resources

[Screenshot functionality](https://betterprogramming.pub/heres-why-i-m-replacing-html2canvas-with-html-to-image-in-our-react-app-d8da0b85eadf)
