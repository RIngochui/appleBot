import { Client, IntentsBitField } from "discord.js";
require('dotenv').config();
//console.log(process.env.DISCORD_BOT_TOKEN) //logging the token
(async () => {
const client = new Client({
        intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]});

    client.on("ready", () => {
        console.log(`${client.user?.username} has logged in!`);
    });

    client.on("messageCreate", (message) => {
        console.log(`[${message.author.tag}]: ${message.content}`);
        if (message.content === '!tf') {
            message.channel.send({
                files: [{
                    attachment: 'https://cdn.frankerfacez.com/emoticon/84392/1',
                    name: 'file.jpg',
                    description: 'A description of the file'
                }]
            });
        }
    });

    await client.login(process.env.DISCORD_BOT_TOKEN);

})();