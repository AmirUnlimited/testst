const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the current queue!'),
    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return await interaction.reply({ content: `❌ <@${interaction.user.id}>, There is no music currently playing!.`, ephemeral: true});
    
        if (!queue.tracks[0]) return await interaction.reply({ content: `❌ <@${interaction.user.id}>, No music is in queue after current music.`, ephemeral: true});
    
        const embed = new MessageEmbed();
    
        embed.setColor('RED');
        embed.setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }));
        embed.setTitle(`${interaction.guild.name} - Server Queue`);
    
        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - \`${track.title}\` (Requested by <@${track.requestedBy.id}>)`);
    
        const songs = queue.tracks.length;
        const nextSongs = songs > 5 ? `And **${songs - 5}** Other Song...` : `There are **${songs}** Songs in the List.`;
    
        embed.setDescription(`Currently Playing: \`${queue.current.title}\`\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`);
    
        embed.setTimestamp();
        embed.setFooter({ text: 'Guitar Music' });
        await interaction.reply({ embeds: [embed] })
    }
}