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

  //format chat message to read
  const commandName = msg.trim().toLowerCase();

  // bgleaderboard
  if (commandName === '!test') {
    if(Date.now() >= lastCommandResponded+5000){
        lastCommandResponded = Date.now();
        scrapeLeaderboard(client,target)
        .then(response=>{
            var printMe = "Success: "+response;
            console.log(printMe);
            client.say(target,printMe);
        });
    }else{
        console.log("Command recognized, rate limiting");
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

const Nightmare = require('nightmare');
const cheerio = require('cheerio');
const URL = 'https://playhearthstone.com/en-us/community/leaderboards?region=US&leaderboardId=BG';
// const URL = 'https://google.com/'
function scrapeLeaderboard(client,target){
    return new Promise((resolve, reject) => {
        console.log("attempting nightmare scrape")
        const nightmare = Nightmare({
            waitTimeout: 120000,
            gotoTimeout: 120000,
            loadTimeout: 120000
        });
        nightmare.goto(URL)
        .wait('.LeaderboardsTable-Rendered')
        // .wait('body')
        .evaluate(()=>document.querySelector('.LeaderboardsTable-Rendered').innerHTML)
        .end()
        .then(response=>{
            // console.log(getData(response));
            var topLeaderboard = getData(response);
            resolve(topLeaderboard)
        }).catch(err=>{
            console.log(err);
        })
        let getData = html=>{
            // data = [];
            var data = "";
            const $ = cheerio.load(html);
            console.log($.text());
            data = $.text().substring(0,10);
            // data.push
            return data;
        }

    });
}
