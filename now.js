const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName('now')
        .setDescription('Displays what music is playing right now')
        .addSubcommand(subcommand => subcommand
            .setName('playing')
            .setDescription('What music is playing right now?')),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return await interaction.reply({ content: `❌ ${interaction.user}, There is no music currently playing!.`, ephemeral: true });

        const track = queue.current;

        const embed = new MessageEmbed();

        embed.setColor('RED');
        embed.setThumbnail(track.thumbnail);
        embed.setTitle(track.title)
        embed.setURL(track.url)

        const methods = ['disabled', 'track', 'queue'];

        const timestamp = queue.getPlayerTimestamp();
        const progress = queue.createProgressBar();
        const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;

        embed.setDescription(`Volume: **%${queue.volume}**\nDuration: **${trackDuration}**\nLoop Mode: **${methods[queue.repeatMode]}**\n${progress}`);

        embed.setTimestamp();
        embed.setFooter({ text: `Requested by ${track.requestedBy.tag}`, iconURL: track.requestedBy.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });

    }
}