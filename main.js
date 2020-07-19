const Discord = require('discord.js');
const { userInfo } = require('os');

const client = new Discord.Client();

const token = 'NzI1NzY3NTgxNDc0MDk1MTQ1.XvTh3Q.kbORQ2n4HMilcIk_sUEhg1xGUGs';

const cmdPrefix = '!';

let guild = '';

let dateCardCategory = '';

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

let dateRoomChannels = [];

let dateRoomChannelsSet = [];

let commandRoom = "727982918206750752"

let roundNumber = 0;

let reactionIDMap = new Map();

let setupState = false;

let userInfoMap = new Map();






client.once('ready', () => {
    console.log('Speedy is online!');

guild = client.guilds.cache.get('720746304350978130');

dateCardCategory = guild.channels.cache.get('727611871884214302');

startupChannel = guild.channels.cache.get('725456021107245167');

TeamA = guild.roles.cache.get('724673525088124999');

TeamB = guild.roles.cache.get('724673579924324462');

//colors = ["#000000","#FF0000","#00FF00","#FF00FF","#00FFFF","#FF8000","#FFFFFF","#CC99FF","#FFFF00","#9999FF","#66FFB2"]

/*reactionIDMap.set('727029860022747166', (reaction, user) => {
    let teamName = reaction.emoji.name == '🅰️' ? TeamA: TeamB;
    guild.members.fetch(user).then((member) => {
            member.roles.add(teamName).then(() => {
                console.log(`Added the role to ${member.displayName}`);
            });
            guild.channels.create(member.displayName+' datecard',{ type: 'text'})
            .then(m => {
                m.setParent('727611871884214302')
                m.createOverwrite(guild.id, {
                    VIEW_CHANNEL: false
                })
            
                m.createOverwrite(user, {
                    VIEW_CHANNEL: true
                })
                    
            })
            //send a little welcome message or something so its not an empty channel.
    });
});*/


//tell bot where to find all of the IDs for DateCard channels
//set up array to hold all DateCard text channel IDs
//fill up array with IDs
//dateCardIDs = guild.channels.cache.get("727611871884214302").value.children.keys().push();
let channelSet = guild.channels.cache.get("727611871884214302").children;
for (const key of channelSet.keys()) {
    dateCardChannels.push(key)
    dateCardChannelsSet.add(key)
}

let dateRoomSet = guild.channels.cache.get("725407145725788173").children;
for (const key of dateRoomSet.keys()) {
    dateRoomChannels.push(key)
    //dateRoomChannelsSet.add(key)
}


//listen for response to reaction button
//save likes to set to know who wants to date who again

/*startupChannel.messages.fetch('727029860022747166').then(
    message => console.log('sup bitch')
    )
*/
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
            if(setupState) return;
            for(let i = 0; i < dateCardChannels.length; i++){
                client.channels.cache.get(dateCardChannels[i]).delete();
            }
            dateCardChannels = [];
            dateCardChannelsSet = new Set();
            client.channels.cache.get('725456021107245167').bulkDelete(20);
            let embed1 = new Discord.MessageEmbed()
            .setColor("#55FFFF")
            .setDescription("Welcome to Blindfold Speed Dating!\nBefore we let you inside, we need to know which group you should be in.");
            
            let embed2 = new Discord.MessageEmbed()
                .setColor("#55FFFF")
                .setTitle("Click the RED A if you are a FEMALE interested in MALES \nClick the BLUE B if you are MALE interested in FEMALES");
                
            client.channels.cache.get('725456021107245167').send(embed1).then(() => {
                client.channels.cache.get('725456021107245167').send(embed2).then(async msg => {
                    msg.react('🅰️');
                    msg.react('🇧');
                    reactionIDMap.set(msg.id, (reaction, user) => {
                        if(user.bot) return; 
                        let teamName = reaction.emoji.name == '🅰️' ? TeamA: TeamB;
                        guild.members.fetch(user).then((member) => {
                                member.roles.add(teamName).then(() => {
                                    console.log(`Added the role to ${member.displayName}`);
                                });
                                guild.channels.create(member.displayName+' datecard',{ type: 'text'})
                                .then(myDateCardChannel => {
                                    myDateCardChannel.setParent('727611871884214302')
                                    myDateCardChannel.createOverwrite(guild.id, {
                                        VIEW_CHANNEL: false
                                    })
                                
                                    myDateCardChannel.createOverwrite(user, {
                                        VIEW_CHANNEL: true
                                    })
                                    myDateCardChannel.send('hey this is your private date card! none of the other daters can see this, just you. Im gonna ask you between each of your dates to see if you match with them or not')       
                                    let userInfo = {};
                                    userInfo['dateCardChannel'] = myDateCardChannel;
                                    userInfo['member'] = user;
                                    userInfo['likes'] = new Set();
                                    userInfo['dislikes'] = new Set();
                                    userInfoMap.set(user.id, userInfo);
                                })
                                //send a little welcome message or something so its not an empty channel.
                        });
                    });
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

        case 'dateroomchannels':
            console.log("dateRoomChannels \n"+dateRoomChannels+"\n")
            break;

        case 'test':
            
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
        case 'endround':

            let roundOfDates = dates[roundNumber];
            for(let i = 0; i < roundOfDates.length; i++){
                let userA = userInfoMap.get(roundOfDates[i][0]);
                let userB = userInfoMap.get(roundOfDates[i][1]);


                let color = '#' + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6);
                //print series of messages to each person's individual "Date Cards" (which is actually just a text channel) where they say if they match or not
                let reportq = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription("If you need to report this person for any reason, please click the ❗ below")

                let blindfoldq = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle("Did you wear your blindfold on your date?")
                    .setDescription("Please answer honestly, we are just curious to see if the blindfold makes a difference\n:thumbsup:  - Yes\n:no_entry_sign:  - No");

                let interestq = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle("How interested are you in talking to your last date again?")
                    .setDescription(":laughing: - very interested\n:slight_smile: - interested\n:no_entry_sign: - not interested");
                    
                let feelingsq = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle("Briefly, write any thoughts or feelings you had on this date.")

                //chain message sends inside of .then()    
                let targetChannel = userA.dateCardChannel
                targetChannel.send(reportq).then(async msg => {
                    msg.react('❗');
                    reactionIDMap.set(msg.id, (reaction, user) => {
                        if(reaction.emoji.name == '❗'){
                            client.channels.cache.get(commandRoom).send(userA.member.username+' reported '+userB.member.username)
                            //someday save this reaction to the database or whereever we are saving stuff
                        }
                    })
                });

                targetChannel.send(blindfoldq).then(async msg => {
                    msg.react('👍');
                    msg.react('🚫');
                });    
                
                targetChannel.send(interestq).then(async msg => {
                    msg.react('😆');
                    msg.react('🙂');
                    msg.react('🚫');
                    reactionIDMap.set(msg.id, (reaction, user) => {
                        if(reaction.emoji.name == '😆' || reaction.emoji.name == '🙂'){
                            userA.likes.add(userB.member.id)
                            client.channels.cache.get(commandRoom).send('taco')

                        } else if(reaction.emoji.name == '🚫'){
                            userA.dislikes.add(userB.member.id)
                            client.channels.cache.get(commandRoom).send('burrito')
                        }              
                    })
                });

                targetChannel.send(feelingsq)



                targetChannel = userB.dateCardChannel
                targetChannel.send(reportq).then(async msg => {
                    msg.react('❗');
                    reactionIDMap.set(msg.id, (reaction, user) => {
                        if(reaction.emoji.name == '❗'){
                            //client.channels.cache.get('727982918206750752').send(user.username);
                            client.channels.cache.get(commandRoom).send(userB.member.username+' reported '+userA.member.username)
                            //someday save this reaction to the database or whereever we are saving stuff
                        }
                    })
                });

                targetChannel.send(blindfoldq).then(async msg => {
                    msg.react('👍');
                    msg.react('🚫');
                });
                
                targetChannel.send(interestq).then(async msg => {
                    msg.react('😆');
                    msg.react('🙂');
                    msg.react('🚫');
                    reactionIDMap.set(msg.id, (reaction, user) => {
                        if(reaction.emoji.name == '😆' || reaction.emoji.name == '🙂'){
                            userB.likes.add(userA.member.id);
                        } else if(reaction.emoji.name == '🚫'){
                            userB.dislikes.add(userA.member.id);
                        }  
                    })
                });

                //store message ID of previous three messages in targetChannel, so we can find the reactions later.
                //console.log(targetChannel.messages.fetch({ limit: 3 }))

                targetChannel.send(feelingsq)

            }

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
            roundNumber++;
            break;

        case 'startround':
            //move the right pair of users to the right date room based on round
            //iterate through rounds
            //iterate through pairs of dates
            for(pair = 0; pair < dates.length; pair++){
                for(dater = 0; dater < 2; dater++){
                    //iterate through each dater in pair
                    if(dates[roundNumber][pair][dater] !== null){
                        guild.members.cache.get(dates[roundNumber][pair][dater]).voice.setChannel(dateRoomChannels[pair]);
                        //console.log(dates[roundNumber][pair][dater], dateRoomChannels[pair]);
                    }
                }
            }
            break;

        //set bot to push messages to datecards after each date
        case 'datecards':
            //print series of messages to each person's individual "Date Cards" (which is actually just a text channel) where they say if they match or not
            /*let reportq = new Discord.MessageEmbed()
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
            }*/
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
    /*if(reaction.message.id === '727029860022747166'){
        let teamName = reaction.emoji.name == '🅰️' ? TeamA: TeamB;
        guild.members.fetch(user).then((member) => {
                member.roles.add(teamName).then(() => {
                    console.log(`Added the role to ${member.displayName}`);
                });
                guild.channels.create(member.displayName+' datecard',{ type: 'text'})
                .then(m => {
                    m.setParent('727611871884214302')
                    m.createOverwrite(guild.id, {
                        VIEW_CHANNEL: false
                    })
                
                    m.createOverwrite(user, {
                        VIEW_CHANNEL: true
                    })
                    //console.log(guild.channels.cache.get("727611871884214302").children);
                })
                //send a little welcome message or something so its not an empty channel.
        });
    }*/
    if(!user.bot && reactionIDMap.has(reaction.message.id)){
        reactionIDMap.get(reaction.message.id)(reaction, user);
    };

});

client.login(token);