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

//This is set up such that you can't call upon the bot more than once every 5 seconds
var lastCommandResponded = Date.now()-5000;

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim().toLowerCase();

  // bgleaderboard
  if (commandName === '!test') {

    if(Date.now() >= lastCommandResponded+5000){
        client.say(target,"BANG BANG SKEET SKEET")
        lastCommandResponded = Date.now();
    }else{
        console.log("Command recognized, rate limiting");
    }

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