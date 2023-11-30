const { SlashCommandBuilder } = require('discord.js')

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
    const subcmd = interaction.options.getSubcommand()
    const woche = interaction.options.getInteger('woche')
    const jahr = interaction.options.getInteger('jahr')

    if (subcmd === 'alle') {
      await interaction.reply({ content: `Sende Verfügbare PDFs für ${klasse.klasse} in den DMs!`, ephemeral: true })
      klasse.sendeAlleDokumente('berichtsheft', interaction.user)
    }
    else {
      await interaction.reply({ content: `Sende Verfügbare PDFs für ${klasse.klase} der Woche ${woche} in den DMs!`, ephemeral: true })
      klasse.sendeWochenDokumente('berichtsheft', interaction.user, woche, jahr)
    }
  },
}
