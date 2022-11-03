import { Queue } from "discord-music-player";
import { Client, TextChannel} from "discord.js";
import { settings } from "../bot";

export const getQueue = async (client: Client, guildQueue: Queue) => {
    const channel = await client.channels.fetch(settings.ID).catch(console.error);
    if (channel instanceof TextChannel) {
        let queueString = `The next ten songs in queue: \n `
        let count = 0;
        while(count < guildQueue.songs.length && count < 10) {
            queueString += `\t${count + 1}. ${guildQueue.songs.at(count)?.name} \n`
            count++;
        }
        (channel as TextChannel).send(queueString);
    }
}

