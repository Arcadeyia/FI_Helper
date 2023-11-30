const { SlashCommandBuilder } = require('discord.js')
// Erstellung des Commands
module.exports = {
  data: new SlashCommandBuilder()
    .setName('berichtsheft')
    .setDescription('Forder Berichtshefte an.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('alle')
        .setDescription('Fordere alle Berichtshefte der Klasese an.'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('woche')
        .setDescription('Fordere Berichtshefte für eine bestimmte Woche an.')
        .addIntegerOption(option =>
          option.setName('woche')
            .setDescription('Die gewünschte Woche des Berichtsheftes.')
            .setRequired(true)
            .setMaxValue(52)
            .setMinValue(1),
        )
        .addIntegerOption(option =>
          option.setName('jahr')
            .setDescription('Das gewünschte Jahr des Berichtheftes.')
            .setRequired(true))),
  async execute(interaction, client, klasse) {
    // Setzt den angegebene Subcommand
    const subcmd = interaction.options.getSubcommand()
    // Setzt die angegebene Woche
    const woche = interaction.options.getInteger('woche')
    // Setzt das angegebene Jahr
    const jahr = interaction.options.getInteger('jahr')
    // Wenn man "alle" wählt
    if (subcmd === 'alle') {
      // Antworte auf den Command
      await interaction.reply({ content: `Sende Verfügbare PDFs für ${klasse.klasse} in den DMs!`, ephemeral: true })
      // Führt Klassenfunktion aus
      klasse.sendeAlleDokumente('berichtsheft', interaction.user)
    }
    else {
      // Antworte auf den Command
      await interaction.reply({ content: `Sende Verfügbare PDFs für ${klasse.klase} der Woche ${woche} in den DMs!`, ephemeral: true })
      // Führt Klassenfunktion aus
      klasse.sendeWochenDokumente('berichtsheft', interaction.user, woche, jahr)
    }
  },
}
