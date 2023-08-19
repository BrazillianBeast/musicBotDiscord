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
})

client.on('ready', () => {
    console.log('BOT is ONLINE!');
})

client.on('messageCreate', message => {
    console.log(
        `got a message: ${message}`
    )
    if (message.author.bot) return;

    const prefix = "?";
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    
    // console.log('recebi uma mensagem')
    if (!message.content.toLowerCase().startsWith(prefix))return;

    if (args.shift().toLowerCase() === "play"){
        client.Distube.play(message.member.voice.channel, args.join(" "), {
            member: message.member,
            textChannel: message.channel,
            message
        });
    }

});

client.Distube.on("playSong", (queue, song) => {
   queue.textChannel.send(`Tocando agora: ${song.name}`);
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