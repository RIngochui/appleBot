import { channel } from "diagnostics_channel";
import { Queue, Song, Playlist } from "discord-music-player";
import { Client, IntentsBitField, Message, TextChannel, EmbedBuilder } from "discord.js";
import { sendLogsAsMessages } from "./functions/sendLogsAsMessages";
import { sendEmbed } from "./functions/sendEmbed";
const { OpusEncoder } = require('@discordjs/opus');
const { Player, RepeatMode } = require("discord-music-player");
require('dotenv').config();

export const settings = {
    prefix: '!',
    token: process.env.DISCORD_BOT_TOKEN,
    ID: '622548186371981338',
};

(async () => {
    const client = new Client({
        intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ]});

    const { Player } = require("discord-music-player");
    const player = new Player(client, {
        leaveOnEmpty: false,
    });
    
    // Init the event listener only once (at the top of your code).
    player
        // Emitted when channel was empty.
        .on('channelEmpty', async (queue: Queue) =>
            sendLogsAsMessages(client, `Everyone left the Voice Channel, queue ended.`))
        // Emitted when a song was added to the queue.
        .on('songAdd', async (queue: Queue, song: Song) => {
            console.log(`Song ${song} was added to the queue.`)
            sendEmbed(client, `Song ${song} was added to the queue.`, song.url, song.name, song.thumbnail)
        })
        // Emitted when a playlist was added to the queue.
        .on('playlistAdd',  (queue: Queue, playlist: Playlist) => {
            console.log(`Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`)
            sendEmbed(client, `Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`, playlist.url, playlist.name, playlist.songs.at(0)?.thumbnail)
        })
        // Emitted when there was no more music to play.
        .on('queueDestroyed',  (queue: Queue) =>
            sendLogsAsMessages(client, `The queue was destroyed.`))
        // Emitted when the queue was destroyed (either by ending or stopping).    
        .on('queueEnd',  (queue: Queue) =>
            sendLogsAsMessages(client, `The queue has ended.`))
        // Emitted when a song changed.
        .on('songChanged', (queue: Queue, newSong: Song, oldSong: Song) => {
            console.log(`${newSong} is now playing.`)
            sendEmbed(client, `${newSong} is now playing.`, newSong.url, newSong.name, newSong.thumbnail)
        })
        // Emitted when a first song in the queue started playing.
        .on('songFirst',  (queue: Queue, song: Song) =>
            sendLogsAsMessages(client, `Started playing ${song}.`))
        // Emitted when someone disconnected the bot from the channel.
        .on('clientDisconnect', (queue: Queue) =>
            sendLogsAsMessages(client, `I was kicked from the Voice Channel, queue ended.`))
        // Emitted when deafenOnJoin is true and the bot was undeafened
        .on('clientUndeafen', (queue: Queue) =>
            sendLogsAsMessages(client, `I got undefeanded.`))
        // Emitted when there was an error in runtime
        .on('error', (error: Error, queue: Queue) => {
            sendLogsAsMessages(client, `Error: ${error} in ${queue.guild.name}`);
        });

    client
        .on("ready", async () => {
            sendLogsAsMessages(client, "appleBot has logged-in!");
        })

        .on('messageCreate', async (message) => {
            const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
            const command = args.shift();
            let guildQueue = player.getQueue(message.guildId);
        
            if(command === 'play') {
                let queue = player.createQueue(message.guildId);
                await queue.join(message.member?.voice.channel);
                let song = await queue.play(args.join(' ')).catch((err: Error) => {
                    console.log(err);
                    if(!guildQueue)
                        queue.stop();
                });
            }
        
            if(command === 'playlist') {
                let queue = player.createQueue(message.guildId);
                await queue.join(message.member?.voice.channel);
                let song = await queue.playlist(args.join(' ')).catch((err : Error) => {
                    console.log(err);
                    if(!guildQueue)
                        queue.stop();
                });
            }
        
            if(command === 'skip') {
                guildQueue.skip();
            }
        
            if(command === 'stop') {
                guildQueue.stop();
            }
        
            if(command === 'removeLoop') {
                guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
            }
        
            if(command === 'toggleLoop') {
                guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
            }
        
            if(command === 'toggleQueueLoop') {
                guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
            }
        
            if(command === 'setVolume') {
                guildQueue.setVolume(parseInt(args[0]));
            }
        
            if(command === 'seek') {
                guildQueue.seek(parseInt(args[0]) * 1000);
            }
        
            if(command === 'clearQueue') {
                guildQueue.clearQueue();
            }
        
            if(command === 'shuffle') {
                guildQueue.shuffle();
            }
        
            if(command === 'getQueue') {
                console.log(guildQueue);
            }
        
            if(command === 'getVolume') {
                console.log(guildQueue.volume)
            }
        
            if(command === 'nowPlaying') {
                console.log(`Now playing: ${guildQueue.nowPlaying}`);
            }
        
            if(command === 'pause') {
                guildQueue.setPaused(true);
            }
        
            if(command === 'resume') {
                guildQueue.setPaused(false);
            }
        
            if(command === 'remove') {
                guildQueue.remove(parseInt(args[0]));
            }
        
            if(command === 'createProgressBar') {
                const ProgressBar = guildQueue.createProgressBar();
                
                // [======>              ][00:35/2:20]
                console.log(ProgressBar.prettier);
            }

            if(command === 'emote') {
                
            }
        })
    
    client.login(settings.token);

})();