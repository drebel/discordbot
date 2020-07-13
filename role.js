var rolesetup = function(Discord, client, message) {
    let embed1 = new Discord.MessageEmbed()
        .setColor("#55FFFF")
        .setDescription("Welcome to Blindfold Speed Dating!\nBefore we let you inside, we need to know which group you should be in.");
            
    let embed2 = new Discord.MessageEmbed()
        .setColor("#55FFFF")
        .setTitle("Click the RED A if you are a FEMALE interested in MALES \nClick the BLUE B if you are MALE interested in FEMALES");
           
    message.channel.send(embed1).then(() => {
        message.channel.send(embed2).then(async msg => {
            await msg.react('🅰️');
            await msg.react('🇧');
        })
    })
}
module.exports = rolesetup;