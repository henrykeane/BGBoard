const tmi = require('tmi.js')

//options
const opts = {
    identity:{
        username: 'neeshbot',
        password: 'oauth:693t9d8okhhsdnlhyjmh53jb8uhkiz'
    },
    channels:[
        'neesh245'
    ]
};




// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim().toLowerCase();

  // If the command is known, let's execute it
  if (commandName === '!bgleaderboard') {
    //LEADERBOARD SCRAPE

    // const num = rollDice();
    // client.say(target, `You rolled a ${num}`);
    // console.log(`* Executed ${commandName} command`);
  }
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}