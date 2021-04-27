//Dependancies
require("dotenv").config();
const TMI = require("tmi.js");

// Bot Name and Password
const BOT_NAME = "sentinal_bot";
// const TMI_OAUTH = "<tmi oauth token here>";
const TMI_OPTIONS = {
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  channels: ["s0n_h3li0s"],
};

// Connect bot to channels and get client instance
const client = new TMI.client(TMI_OPTIONS);
connectIRC();

client.on("disconnect", onDisconnectHandler);
client.on("message", onMessageHandler);
client.on("raided", onRaidHandler);
client.on("subscription", onSubHandler);
client.on("timeout", onTimeOutHandler);
client.connect();

let userPool = [
  {
    username: "s0n_h3li0s",
    subscriber: true,
  },
];

let setIntervalMessage = [
  "/me If you like what you see, don't wait to hit that follow button! You'll get my content for absolutely free, aaaand get to hang out my nerd ass.",
  "/me For the lurkers: I love all of you and if you come back, I'll give you cookies! <3",
  "/me Though not required, if you'd like to support me and the stream, feel free to subscribe!",
  "/me REMINDER: Free prime sub available! (just kidding, but feel free)",
  "/me Thank you guys for being here! Y'all are the best. If you want to keep up with me or the stream heres the discord link: https://discord.gg/ftfZswTnnB",
];

// Delays first message to give time for the bot to connect to IRC server
setTimeout(function () {
  // Throws message to chat on an interval
  setInterval(
    function () {
      let intervalRandom = Math.floor(
        Math.random() * setIntervalMessage.length
      );
      let date = new Date();
      let hours = date.getHours();
      let mins = date.getMinutes();
      let time = `${hours}:${mins}`;
      console.log(`message sent @ ${time}`);
      client.say("s0n_h3li0s", setIntervalMessage[intervalRandom]);
    },
    // 30 minute interval
    1800000
  );
}, 1000);

// Called every time a message is typed in a chat that the bot is connected to
function onMessageHandler(target, context, message, self) {
  // Just leave this function if the message is from self
  if (self) {
    return;
  }

  // Sets up object pre push to userPool
  //=============================================================================================================================================
  user = { username: context.username, subscriber: context.subscriber };
  //=============================================================================================================================================

  let trimmedMessage = message.trim();
  let splitMessage = trimmedMessage.split(" ");
  let targetUser = user.username;
  if (splitMessage.length > 1) {
    targetUser = splitMessage[1];
  }
  let greetingMessage = [
    `Hey there @${context.username}! Super excited you are here today! Tell the class how you're doin'`,
    `What's up @${context.username}? Glad you're joining us! How are ya?`,
    `Howdy @${context.username}?! Thanks for joining, Hope you're doing well!`,
    `ATTENTION: @${context.username} has entered the area!`,
  ];

  // Matches a hard coded String to match against bot messages to auto delete
  //=============================================================================================================================================
  let autoDeleteBotMessage =
    "Wanna become famous? Buy followers and viewers on https://clck.ru/UH8eF";
  let autoDeleteSplitMessage = autoDeleteBotMessage.split(" ");
  let matchCounter = 0;

  if (
    splitMessage[0].toLowerCase() === autoDeleteSplitMessage[0].toLowerCase() &&
    splitMessage[1].toLowerCase() === autoDeleteSplitMessage[1].toLowerCase()
  ) {
    for (let a = 0; a < splitMessage.length; a++) {
      if (
        splitMessage[a].toLowerCase() ===
        autoDeleteSplitMessage[a].toLowerCase()
      ) {
        matchCounter++;
      }
    }
    if (matchCounter > 4) {
      client
        .deletemessage("s0n_h3li0s", context.id)
        .then((data) => {
          console.log(
            `Message from ${context.username} deleted on Channel ${TMI_OPTIONS.channels[0]}\n` +
              `REASON: Bot message deleted.`
          );
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
  }
  //=============================================================================================================================================

  // Greet a user chatting for the first time on the stream
  //=============================================================================================================================================
  let findUser = user.username;
  let match = false;
  for (let i = 0; i < userPool.length; i++) {
    if (findUser === userPool[i].username) {
      console.log(findUser + " found! No push to userPool.");
      match = true;
    } else {
      console.log(findUser + " not found!");
    }
  }

  if (match === false) {
    client.say(
      target,
      greetingMessage[Math.floor(greetingMessage.length * Math.random())]
    );
    console.log(`Greeting message sent to @${targetUser}, userPool updated.`);
    userPool.push(user);
    console.log(userPool);
  }
  //=============================================================================================================================================

  if (
    splitMessage[0].startsWith("!") === true &&
    context.username === "s0n_h3li0s"
  ) {
    let command = splitMessage[0];
    let shoutOutTarget = splitMessage[1];
    switch (command) {
      case "!clear":
        onClearCommand();
        break;
      case "!so":
        onShoutOutCommand(target, shoutOutTarget);
        break;
    }
  }
  if (splitMessage[0].startsWith("!") === true) {
    let command = splitMessage[0];
    switch (command) {
      case "!lurk":
        onLurkCommand(target, context.username);
        break;
      case "!discord":
        onDiscordCommand(target);
        break;
    }
  }

  //Debugging
  //log every message, remove this eventually, for debugging only
  //=============================================================================================================================================
  //   console.log(target, context.username, trimmedMessage);
  //=============================================================================================================================================
}

function onDiscordCommand(target) {
  client.say(
    target,
    "Keep up with me and the stream and whatever I find interesting in my life HERE: https://discord.gg/ftfZswTnnB"
  );
}

function onLurkCommand(target, lurkUser) {
  client.say(
    target,
    `There @${lurkUser} goes! Thanks for the lurk, remember to mute the tab and not the stream! Come back soon and I'll have cookies!`
  );
}

function onShoutOutCommand(target, shoutOutTarget) {
  try {
    let atRemoval = shoutOutTarget.slice(1);
    client.say(
      target,
      `Wowie! Thanks for the support! Make sure to go check out ${shoutOutTarget}'s channel! Link: https://twitch.tv/${atRemoval}`
    );
  } catch (err) {
    console.log(err);
  }
}

function onClearCommand() {
  try {
    client.clear("s0n_h3li0s");
  } catch (err) {
    console.log(err);
  }
}

function onSubHandler(target, username, method, message, userstate) {
  client.say(
    target,
    `Buckle up butter cup! @${username}, you're in for a wild ride! Seriously though, thank you for the support! I love you <3`
  );
}

function onRaidHandler(target, username, viewers) {
  client.say(
    target,
    `Whoa! @${username} is raiding with ${viewers} viewers! What's up guys?!`
  );
}

function onTimeOutHandler(target, username, reason, duration, userState) {
  client.say(target, `Oops! @${username} Is in horny jail for ${duration}`);
}

function connectIRC() {
  client.on("connecting", onConnectingHandler);
  client.on("connected", onConnectedHandler);
}

// Called every time the bot attempts to connect to Twitch chat
function onConnectingHandler(addr, port) {
  console.log(`* Connecting to ${addr}:${port}`);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

// Called if bot disconnects suddenly
function onDisconnectHandler(reason) {
  console.log(`* Bot disconnected from chat. REASON: ${reason}`);
}
