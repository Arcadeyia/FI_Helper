const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stundenplan')
    .setDescription('Forder Stundenpläne an.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('alle')
        .setDescription('Fordere alle Stundenpläne der Klasese an.'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('woche')
        .setDescription('Fordere Stundenpläne für eine bestimmte Woche an.')
        .addIntegerOption(option =>
          option.setName('woche')
            .setDescription('Die gewünschte Woche des Stundenplanes.')
            .setRequired(true)
            .setMaxValue(52)
            .setMinValue(1),
        )
        .addIntegerOption(option =>
          option.setName('jahr')
            .setDescription('Das gewünschte Jahr des Stundenplanes.')
            .setRequired(true))),
  async execute(interaction, client, klasse) {
    const subcmd = interaction.options.getSubcommand()
    const woche = interaction.options.getInteger('woche')
    const jahr = interaction.options.getInteger('jahr')

    if (subcmd === 'alle') {
      await interaction.reply({ content: `Sende Verfügbare PDFs für ${klasse.klasse} in den DMs!`, ephemeral: true })
      klasse.sendeAlleDokumente('stundenplan', interaction.user)
    }
    else {
      await interaction.reply({ content: `Sende Verfügbare PDFs für ${klasse.klasse} der Woche ${woche} in den DMs!`, ephemeral: true })
      klasse.sendeWochenDokumente('stundenplan', interaction.user, woche, jahr)
    }
  },
}
