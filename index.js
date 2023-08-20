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
// const streamOptions = {seek: 0, volume: 1};

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
    // console.log(
    //     `got a message: ${message}`
    // )
    if (message.author.bot) return;

    const prefix = "?";
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    
    // console.log('recebi uma mensagem')
    if (!message.content.toLowerCase().startsWith(prefix))return;

    let comando = args.shift().toLowerCase();
    if (comando === "play"){
        try{
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
            client.Distube.stop(message);
            message.channel.send("Parei de tocar a música!");
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
            client.Distube.skip(message);
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
    queue.textChannel.send("Sem mais músicas na fila, saindo do canal de voz")
});


client.Distube.on("noRelated", queue => queue.textChannel.send("Não encontrei nada relacionado à isso para tocar :( "));

client.Distube.on('error', (channel, e) => {
    if (channel) channel.send(`Um erro foi encontrado: ${e}`)
    else console.error(e)
})










// if(message.content.toLowerCase().startsWith("?play")){
    //     console.log('entrei na condicao')
    //     let voiceChannel = msg.guild.channels.find( channel => channel.id === 
    //         '1035740536876830750');

    //     if (voiceChannel == null){
    //         console.log('Canal nao encontrado')
    //     }

    //     if (voiceChannel !== null){
    //         console.log('O canal foi encontrado');

    //         voiceChannel.join()
    //         .then(connection => {
    //             const stream = ytdl('https://www.youtube.com/watch?v=2kC0EzJ19CshyNu5i_61KA',
    //             { filter: 'audioonly' });

    //             const DJ = connection.playStream(stream, streamOptions);
    //             DJ.on('end', end => {
    //                 voiceChannel.leave();
    //             });
    //         })
    //         .catch(console.error);
    //     }
    // }