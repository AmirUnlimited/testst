module.exports = {
    px: process.env.PREFIX, // Prefix

    opt: { //! Dast nazan
        DJ: { //! Dast nazan
            enabled: false, // agar true bashad, afradi ke role DJ ra darand faghat mitavanand az command haye zir estefade konand, slash command support nemishavad. (Only MESSAGE COMMANDS)
            roleName: 'DJ',
            commands: ['play', 'previous', 'clear', 'filter', 'loop', 'pause', 'resume', 'skip', 'stop', 'volume']
        },
        selfDeaf: true, // Deafen
        maxVol: 100, // Max Volume
        loopMessage: false, //! Dast nazan
        discordPlayer: { //! Dast nazan
            ytdlOptions: { //! Dast nazan
                quality: 'highestaudio', //! Dast nazan
                highWaterMark: 1 << 25  //! Dast nazan
            }
        }
    }
}