const fetch = require('node-fetch');
const config = require('./config.json');
require("dotenv").config();

/**
 * Register the metadata to be stored by Discord. This should be a one time action.
 * Note: uses a Bot token for authentication, not a user token.
 */
const url = `https://discord.com/api/v10/applications/${config.clientId}/role-connections/metadata`;
// supported types: number_lt=1, number_gt=2, number_eq=3 number_neq=4, datetime_lt=5, datetime_gt=6, boolean_eq=7
const body = [
  {
    key: 'islinkedds2',
    name: 'Is Linked',
    description: 'Has linked Duck Simulator 2',
    type: 7,
  },
  {
    key: 'hasbeatends2',
    name: 'Has Beaten',
    description: 'Has beaten Duck Simulator 2',
    type: 7,
  },
  {
    key: 'hascompletedds2',
    name: 'Has Fully Completed',
    description: 'Has fully completed Duck Simulator 2',
    type: 7,
  },
  {
    key: 'secondstocompleteds2',
    name: "Seconds To Complete",
    description: "seconds or less to beat Duck Simulator 2",
    type: 1
  }
];

const response = fetch(url, {
  method: 'PUT',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${process.env.TOKEN}`,
  },
}).then(async response => {
  if (response.ok) {
    const data = await response.json();
    console.log(data);
  } else {
    //throw new Error(`Error pushing discord metadata schema: [${response.status}] ${response.statusText}`);
    const data = await response.text();
    console.log(data);
  }
});