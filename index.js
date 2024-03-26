require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({ 
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildVoiceStates",
        "MessageContent",
    ] 
});
const { DisTube } = require("distube");

client.login(process.env.TOKEN);

client.Distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    leaveOnFinish: true,
})

client.on('ready', () => {
    console.log('BOT is ONLINE!');
})

client.on('messageCreate', message => {
  
    if (message.author.bot) return;

    const prefix = "?";
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    
    if (!message.content.toLowerCase().startsWith(prefix))return;

    let comando = args.shift().toLowerCase();
    if (comando === "play"){
        try{
            let channel = message.member.voice.channel;
            if (!channel) {
                return message.channel.send(`** Você precisar estar em um canal de voz para executar esse comando ${message.member} **`)
              }
            client.Distube.play(message.member.voice.channel, args.join(" "), {
                member: message.member,
                textChannel: message.channel,
                message
            });
        }catch(e){
            console.log(e);
        }
    }
    
    else if (comando === "stop") {
        try{
            let channel = message.member.voice.channel;
            if (!channel) {
                return message.channel.send(`** Você precisar estar em um canal de voz para executar esse comando ${message.member} **`)
              }
            client.Distube.stop(message);
            message.channel.send(`** Parei de tocar a música! ** `);
        }
        catch(e){
            console.log(e);
        }
    }

    else if (comando === "oi"){
        try{
            message.channel.send(`Falaa ${message.member}`);
        }
        catch(e){
            console.log(e);
        }
    }

    else if (comando === "skip"){
        try{
            let currentChannel = message.member.voice.channel;
            if (!currentChannel) {
                return message.channel.send(`** Você precisar estar em um canal de voz para executar esse comando ${message.member} **`)
              }
            let queue = client.Distube.getQueue(message.guild.id);let channel = message.member.voice.channel;
            if (!queue) {
                return message.channel.send(`** Nada tocando **`)
              }
            if (queue.autoplay || queue.songs.length > 1) Distube.skip(message)
            else{ 
                client.Distube.stop(message) 
                message.channel.send("** Sem mais músicas na fila de execução **");
            }
        }
        catch(e){
            console.log(e);
        }
    }

    else if (comando == "queue") {
        try{
            const queue = client.Distube.getQueue(message);
            message.channel.send('Fila atual:\n' + queue.songs.map((song, id) =>
                `**${id+1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
            ).join("\n"));
        }
        catch(e){
            console.log(e);
        }
    }


});

client.Distube.on("playSong", (queue, song) => {
   queue.textChannel.send(`Tocando agora: ${song.name}`);
});

client.Distube.on("finish", (queue) => {
    queue.textChannel.send(`** Sem mais músicas na fila, saindo do canal de voz **`)
});


client.Distube.on("noRelated", queue => queue.textChannel.send(`** Não encontrei nada relacionado à isso para tocar :( ** `));

client.Distube.on('error', (channel, e) => {
    if (channel) channel.send(`Um erro foi encontrado: ${e}`)
    else console.error(e)
})
