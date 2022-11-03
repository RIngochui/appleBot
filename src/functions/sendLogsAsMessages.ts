import { Client, Message, TextChannel } from "discord.js";
import { settings } from "../bot";

export const sendLogsAsMessages = async (client: Client, string: String) => {
    const channel = await client.channels.fetch(settings.ID).catch(console.error);
    if(channel instanceof TextChannel) {
        console.log(string);
        (channel as TextChannel).send({ content: `${string}` });
    }
}