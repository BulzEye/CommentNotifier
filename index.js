const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
require("dotenv").config();
const fetch = require("node-fetch")

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;

const chatId = 1224847249;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token
    ,{polling: true}
);

let file = undefined;
const fileName = "messages.json";

try {
    file = JSON.parse(fs.readFileSync(fileName, {encoding: "utf-8" }));
    console.log(file);
} catch (err) {
    console.log(err);
    console.log("Error reading messages.json file, creating new file");
    fs.writeFileSync("messages.json", "[]", (err) => {
        if (err) {
            console.log("Error creating messages.json file");
        }
    });
    file = [];
}

// console.log(file);

bot.onText(/\/[a-zA-Z]*[ ]*[0-9]*/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
  
    // const chatId = msg.chat.id;
    // const rollNo = match[1]; // the captured "rollNo"
  
    // console.log(match);
  
    // // send back the matched "whatever" to the chat
    // bot.sendMessage(chatId, "Hello " + rollNo);
    switch (match[0]) {
        case "/check":
            console.log("Checking for updates...");
            checkUpdates().then((hasNewComments) => {
                if(!hasNewComments) {
                    bot.sendMessage(chatId, "No new comments");
                }
            });
            break;
        
        default:
            break;
    }
  });

console.log("Hey");

function arraysAreEqual(arr1, arr2) {
    const set1 = new Set(arr1.map(JSON.stringify));
    const set2 = new Set(arr2.map(JSON.stringify));
    if (set1.size < set2.size) return false;
    // for (let item of set1) {
    //     if (!set2.has(item)) return false;
    // }
    return true;
}

function findNewObjects(oldArray, newArray) {
    const oldSet = new Set(oldArray.map(JSON.stringify));
    const newObjects = newArray.filter(obj => !oldSet.has(JSON.stringify(obj)));
    return newObjects;
}

const checkUpdates = async () => {
    console.log("Fetching comments...");
    const msg = await fetch("https://yearbookbackend.profiles.iiti.ac.in/getRecieversComments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://yearbook.iiti.ac.in",
        },
        body: JSON.stringify({
            "comment_reciever_roll_no": "200001057",
        })
    }).then(res => res.json())

    const reducedComments = msg.user2.map(comment => {
        return {
            "id": comment._id,
            "commenter_roll_no": comment.roll_no,
            "commenter_name": comment.name,
            "comment": comment.comment,
        }
    });

    if (arraysAreEqual(file, reducedComments)) {
        console.log("No new comments");
        return false;
    }
    else {
        console.log("New comments received");
        const newComments = findNewObjects(file, reducedComments);
        // console.log(newComments);
        bot.sendMessage(chatId, "New Comments received:");
        newComments.forEach(comment => {
            bot.sendMessage(chatId, `*New Comment*\n*From:* ${comment.commenter_name} (${comment.commenter_roll_no})\n\n_"${comment.comment}"_`, {parse_mode: "Markdown"});
        });
        file = reducedComments;
        fs.writeFileSync(fileName, JSON.stringify(file, null, 2), (err) => {
            if (err) {
                console.log("Error writing to messages.json file");
            }
        });
        return true;
    }
}

checkUpdates();

setInterval(checkUpdates, 1200000);