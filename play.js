const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music!')
        .addStringOption(option => option
            .setName('music')
            .setDescription('Song or URL')
            .setRequired(true)),
    async execute(interaction, client) {
        await interaction.reply('🎸🎶');
        const player = client.player
        const music = interaction.options.getString('music');
        if (!music) return await interaction.reply({ content: `⛔ ${interaction.user}, Write the name of the music you want to search.`, ephemeral: true });
        
        const res = await client.player.search(music, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });
        if (!res || !res.tracks.length) return await interaction.reply({ content: `❌ ${interaction.user}, No results found!`, ephemeral: true });

        const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel
        });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel)
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            return await interaction.reply({ content: `❌ ${interaction.user}, I can't find you in a voice channel or I don\'t have access to it. `, ephemeral: true });
        }

        if (client.config.opt.selfDeaf === false) {
            let channel = interaction.member.voice.channel;
            const { joinVoiceChannel } = require('@discordjs/voice');
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false
            });
        }
        
        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.playing) await queue.play();
    }
}