const http = require("https");
const enumerable = require('linq');
const schedule = require('node-schedule');
const telegramBot = require('node-telegram-bot-api');
// Telegram Bot Token
const tgBotToken = "";
const bot = new telegramBot(tgBotToken, {polling: false});
// Telegram Send Notice Group ID
const chatId = "";
// 幣安寶USDT申購清單
var binanceEarnUrl = '';

// 2秒偵測一次
schedule.scheduleJob('*/2 * * * * *', function(){
    http.get(binanceEarnUrl, function(response){

        var result = '';
        response.on('data', function(chunk){
            result += chunk;
        });

        response.on('end', function(){
    
            var resultJson = JSON.parse(result);
    
            var usdtList = enumerable.from(resultJson.data).where("$.asset == 'USDT'").first();
            var project = enumerable.from(usdtList.list).where("$.duration == '60'").first();
    
            if(project.lotsUpLimit === project.lotsPurchased)
            {
                console.log("售完" + new Date().toISOString());
            }
            else
            {
                var msg = "可以買了~快搶！" + new Date().toISOString();
                bot.sendMessage(chatId, msg);
                console.log(msg);
            }
        });
    }).on('error', function(e){
          console.log("error: ", e);
          bot.sendMessage(chatId, "機器人掛了！ " + new Date().toISOString());
    });
});