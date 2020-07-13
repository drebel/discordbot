const Discord = require('discord.js');

const client = new Discord.Client();

const token = 'NzI1NzY3NTgxNDc0MDk1MTQ1.XvTh3Q.kbORQ2n4HMilcIk_sUEhg1xGUGs';

const cmdPrefix = '!';

let guild = '';

let startupChannel = '';

let TeamA = '';

let TeamB = '';

let AArray = [];

let BArray = [];

let dates = [];

let R1matches = [];

let R2matches = [];

let colors = [];

let dateCardChannels = [];

let dateCardChannelsSet = new Set();

let commandRoom = "727982918206750752"

client.once('ready', () => {
    console.log('Speedy is online!');
guild = client.guilds.cache.get('720746304350978130');

startupChannel = guild.channels.cache.get('725456021107245167')

TeamA = guild.roles.cache.get('724673525088124999');

TeamB = guild.roles.cache.get('724673579924324462');

colors = ["#000000","#FF0000","#00FF00","#FF00FF","#00FFFF","#FF8000","#FFFFFF","#CC99FF","#FFFF00","#9999FF","#66FFB2"]

//tell bot where to find all of the IDs for DateCard channels
//set up array to hold all DateCard text channel IDs
//fill up array with IDs
//dateCardIDs = guild.channels.cache.get("727611871884214302").value.children.keys().push();
let channelSet = guild.channels.cache.get("727611871884214302").children;
for (const key of channelSet.keys()) {
    dateCardChannels.push(key)
    dateCardChannelsSet.add(key)
}
console.log(dateCardChannelsSet)

//if channel's name starts with mydatecard push it into dateCardIDs[]
/*if(let key of guild.channels.cache.get().name.substring[0,10] = 'mydatecard') {
    dateCardIDs.push(key)
}
*/

/*for(let key of guild.channels.cache.keys()){
    dateCardIDs.push(key);
}*/

//console.log("these are the dateCardIDs \n" + dateCardIDs);

//listen for response to reaction button
//save likes to set to know who wants to date who again

startupChannel.messages.fetch('727029860022747166').then(
    message => console.log('sup bitch')
    )

});

client.on('message', message => {
    
    if(dateCardChannelsSet.has(message.channel.id)){
        if(message.author.id !== "725767581474095145"){
            if(message.author.id !== '697254834533040161'){
                console.log(message.content);
                return;
            }           
        }
    };

    if (message.content[0] !== cmdPrefix || message.content.length >100){ 
        return;
    }

    if(message.author.id !== '697254834533040161'){
        return;
    }

    let args = message.content.split(" ");
    args[0] = args[0].substring(cmdPrefix.length);
    switch(args[0]){
        case 'rolesetup':
            let embed1 = new Discord.MessageEmbed()
            .setColor("#55FFFF")
            .setDescription("Welcome to Blindfold Speed Dating!\nBefore we let you inside, we need to know which group you should be in.");
            
            let embed2 = new Discord.MessageEmbed()
                .setColor("#55FFFF")
                .setTitle("Click the RED A if you are a FEMALE interested in MALES \nClick the BLUE B if you are MALE interested in FEMALES");
                
            message.channel.send(embed1).then(() => {
                message.channel.send(embed2).then(async msg => {
                    msg.react('🅰️');
                    msg.react('🇧');
                })
            })
            break;

        case 'clear':
           message.channel.bulkDelete(100);
           break;

        case 'delete':
            message.channel.bulkDelete(args[1]);
            break;

        case 'cleardatecards':
        //clear all datecard channels
        for(let i = 0; i < dateCardChannels.length; i++){
            let channel = dateCardChannels[i]
            let targetChannel = client.channels.cache.get(channel)
            if (targetChannel) {
                targetChannel.bulkDelete(100);    
            }}

        case 'test':
            console.log(dates)
            break;
        
        case 'setupdates':
            //translate number of people parameter to actual ints to put into array
            //go thru teamA and get each user's ID
            dates = [];

            AArray =[];
            for (let key of TeamA.members.keys()) {
                AArray.push(key);
            }

            BArray =[];
            for (let key of TeamB.members.keys()) {
                BArray.push(key);
            }
           
            if(AArray.length > BArray.length){
                let bLen = BArray.length
                for(i = 0;i < AArray.length - bLen; i++){
                    BArray.push(null);
                }
            }else if(AArray.length < BArray.length){
                let aLen = AArray.length
                for(i = 0;i < BArray.length - aLen; i++){
                    AArray.push(null);
                }
            }
            for(let AIndex = 0; AIndex < AArray.length; AIndex++){
                dates.push([]);
            }
            console.log(dates);


            for(let AIndex = 0; AIndex < AArray.length; AIndex++){
                let dateindex = 0;
                for(let BIndex = AIndex; BIndex < BArray.length; BIndex++){
                    dates[dateindex].push([AArray[AIndex],BArray[BIndex]]);
                    //dates.push([AArray[AIndex],BArray[BIndex]]);
                    dateindex++;
                }
                for(let BIndex = 0; BIndex < AIndex; BIndex++){
                    dates[dateindex].push([AArray[AIndex],BArray[BIndex]]);
                    //dates.push([AArray[AIndex],BArray[BIndex]]);
                    dateindex++;
                }
                
            }
            console.log('done with arrays')
            break; 

        case 'printaarray':
            for(let i = 0; i < AArray.length; i++){
                console.log('TeamA '+AArray[i])
                }
            break;

        case 'printbarray':
            for(let i = 0; i < BArray.length; i++){
                console.log('TeamB '+BArray[i])
                }
            break;

        case 'dates':
            console.log(dates)
            break;

        //move users back to respective lounges to end the dates
        case 'enddates':
            //these work but will break if they have to deal with a null in A/BArray or if someone isnt in a voice channel
            //(node:5404) UnhandledPromiseRejectionWarning: DiscordAPIError: Target user is not connected to voice.
            /*for(let AIndex = 0; AIndex < AArray.length;AIndex++){
                guild.members.cache.get(AArray[AIndex]).voice.setChannel("720746304350978135")
                }

            for(let BIndex = 0; BIndex < BArray.length; BIndex++){
                guild.members.cache.get(BArray[BIndex]).voice.setChannel("725410088294285342")
                
            }*/

            //trying to figure out how to make it so if they are not in a voice channel 
            for(let AIndex = 0; AIndex < AArray.length; AIndex++){
                if(AArray[AIndex] != null){
                    if(guild.members.cache.get(AArray[AIndex]).voice.channel !== null){
                        guild.members.cache.get(AArray[AIndex]).voice.setChannel("720746304350978135");
                        message.channel.send('I moved '+AArray[AIndex]);
                    }else{
                        message.channel.send(AArray[AIndex]+' isnt in a voice channel')
                    }
                }
            }

            for(let BIndex = 0; BIndex < BArray.length; BIndex++){
                if(BArray[BIndex] != null){
                    if(guild.members.cache.get(BArray[BIndex]).voice.channel !== null){
                        guild.members.cache.get(BArray[BIndex]).voice.setChannel("725410088294285342");
                        message.channel.send('I moved '+BArray[BIndex]);
                    }else{
                        message.channel.send(BArray[BIndex]+' isnt in a voice channel')
                    }
                }
            }
            break;

        case 'startround':
            //move the right pair of users to the right date room based on round
            break;

        //set bot to push messages to datecards after each date
        case 'datecards':
            //print series of messages to each person's individual "Date Cards" (which is actually just a text channel) where they say if they match or not
            let reportq = new Discord.MessageEmbed()
                .setColor(colors[args[1]])
                .setDescription("If you need to report this person for any reason, please click the ❗ below")
            
            let blindfoldq = new Discord.MessageEmbed()
                .setColor(colors[args[1]])
                .setTitle("Did you wear your blindfold on your date?")
                .setDescription("Please answer honestly, we are just curious to see if the blindfold makes a difference\n:thumbsup:  - Yes\n:no_entry_sign:  - No");
            
            let interestq = new Discord.MessageEmbed()
                .setColor(colors[args[1]])
                .setTitle("How interested are you in talking to your last date again?")
                .setDescription(":laughing: - very interested\n:slight_smile: - interested\n:no_entry_sign: - not interested");
                
            let feelingsq = new Discord.MessageEmbed()
                .setColor(colors[args[1]])
                .setTitle("Briefly, write any thoughts or feelings you had on this date.")
                
            //need some way for daters to reply, either text based replies or reaction buttons.    
            for(let i = 0; i < dateCardChannels.length; i++){
                let channel = dateCardChannels[i]
                let targetChannel = client.channels.cache.get(channel)
                if (targetChannel) {
                    targetChannel.send(reportq).then(async msg => {
                        msg.react('❗');    
                        })
                        
                    targetChannel.send(blindfoldq).then(async msg => {
                        msg.react('👍');
                        msg.react('🚫');
                        })

                    targetChannel.send(interestq).then(async msg => {
                        msg.react('😆');
                        msg.react('🙂');
                        msg.react('🚫')
                        })

                    //store message ID of previous three messages in targetChannel, so we can find the reactions later.
                    //console.log(targetChannel.messages.fetch({ limit: 3 }))

                    targetChannel.send(feelingsq)
                }
            }
    }  
});  
/*guild.startupChannel.messages.fetch('727029860022747166').then(
    message => console.log(message.conent)
    //watch when someone reacts to this message. then assign them a role based on their reaction.
    );
    //client.guilds.get('720746304350978130').channels.get('725456021107245167').fetchMessage('726984887466197083');
    We could use .then() here but we don't need the returning promise in this case
       This will just cache the specified message, to make sure
       that 'messageReactionAdd' will always get called */

client.on("messageReactionAdd", (reaction, user) => {
    if(reaction.message.id === '727029860022747166'){
        let teamName = reaction.emoji.name == '🅰️' ? TeamA: TeamB;
        guild.members.fetch(user).then((member) => {
                member.roles.add(teamName).then(() => {
                    console.log(`Added the role to ${member.displayName}`);
                });
            });
        }
});

client.login(token);