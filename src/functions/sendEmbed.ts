import { Client, Message, messageLink, TextChannel, EmbedBuilder, APIEmbedThumbnail } from "discord.js";
import { settings } from "../bot";

export const sendEmbed = async (client: Client, string: String, url: string, title: string, thumbnail?: string) => {
    const channel = await client.channels.fetch(settings.ID).catch(console.error);
    if (channel instanceof TextChannel) {
        const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setURL(url)
        .setDescription(`${string}`)
        .setTitle(title)
        if (thumbnail)
            exampleEmbed.setThumbnail(thumbnail)
    channel.send({ embeds: [exampleEmbed] });
    }
}

