const topNum = 3;				//How many people do we care about
const spamTimer = 5000;			//How often do we limit chat
const refreshTimer = 240000;	//How often do we recheck the leaderboard
const tmi = require('tmi.js')
const Nightmare = require('nightmare');
const cheerio = require('cheerio');
const URL = 'https://playhearthstone.com/en-us/community/leaderboards?region=US&leaderboardId=BG';

//We don't want to spam chat, so we keep track so we only send messages once every 5 seconds
var lastCommandResponded = 0;
var lastData = undefined;

const playerMapping = {
	tidesoftime:"tidesoftime"
}

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
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.on('close',onCloseHandler)
client.connect();

function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  //format chat message to read
  const commandName = msg.trim().toLowerCase();

  // bgleaderboard
  if (commandName === '!bgrank') {
    if(Date.now() >= lastCommandResponded+5000){
		if(Date.now() >= lastCommandResponded+refreshTimer){
	        scrapeLeaderboard(target)
	        .then(response=>{
	            console.log(response);
	            client.say(target,response);
	        });
		}else{
			console.log("past data",lastData)
			client.say(target,lastData);
		}
        lastCommandResponded = Date.now();
    }else{
        console.info("Command recognized, rate limiting");
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

function scrapeLeaderboard(target){
    return new Promise((resolve, reject) => {
        console.info("Nightmare scraping...")
        var longasstime = 120000; //My desktop has trash spectrum internet so im setting this to an absurdly long timeout
        const nightmare = Nightmare({
            waitTimeout: longasstime,
            gotoTimeout: longasstime,
            loadTimeout: longasstime
        });
        nightmare.goto(URL)
        .wait('.LeaderboardsTable-Rendered')
        .evaluate(()=>document.querySelector('#leaderBoardsTable').innerHTML)
        .end()
        .then(response=>{
            var topLeaderboard = getData(response);
            resolve(topLeaderboard)
        }).catch(err=>{
            console.log(err);
        })
        let getData = html=>{
            var data = "";
            const $ = cheerio.load(html);

            var table = $('.LeaderboardsTable-Rendered');
            table.children().each(function(_i, elem) {
            	//Grab each relevant field
                var rank = $(elem).find('.col-rank').text().trim();
                var battletag = $(elem).find('.col-battletag').text().trim();
                var rating = $(elem).find('.col-rating').text().trim();

                //Check to see if the current channel is a special case
                //This was created just to make sure Tides is still posted
                //even if he's rank 4 RareParrot
                var localChannel = false;
				if(playerMapping.hasOwnProperty(target.substr(1))){
					localChannel = true
				}

				//Finicky message formatting.
				//2nd case: if localchannel is top 25 but not within topNum
                if((parseInt(rank) < topNum+1 && battletag) || localChannel){
					var rankRow = `#${rank}: ${battletag} - ${rating}pts`
					if(rank < topNum){
						data += rankRow + " // ";
					}else if(rank > topNum){
						data += " // " + rankRow;
					}else{
						data += rankRow;
					}
                }
            });
            lastData = data;
            return data;
        }

    });
}
function onCloseHandler(){
    console.info("Reconnecting service");
    client.connect();
}