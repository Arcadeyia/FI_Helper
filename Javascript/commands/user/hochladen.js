const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hochladen')
    .setDescription('Lädt PDF von Stundenpläne/Berichtshefte hoch.')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Die Art des Dokuments (stundenplan/berichtsheft)')
        .setRequired(true)
        .addChoices(
          { name: 'Berichtsheft', value: 'berichtsheft' },
          { name: 'Stundenplan', value: 'stundenplan' },
        ))
    .addIntegerOption(option =>
      option.setName('woche')
        .setDescription('Die Woche des Dokuments.')
        .setRequired(true)
        .setMaxValue(52)
        .setMinValue(1))
    .addIntegerOption(option =>
      option.setName('jahr')
        .setDescription('Das Jahr des Dokuments.')
        .setRequired(true)
        .setMaxValue(2030)
        .setMinValue(2020))
    .addAttachmentOption(option =>
      option.setName('attachment')
        .setDescription('Die PDF der Datei.')
        .setRequired(true)),
  async execute(interaction, client, klasse) {
    const type = interaction.options.getString('type')
    const woche = interaction.options.getInteger('woche')
    const jahr = interaction.options.getInteger('jahr')
    const attachment = interaction.options.getAttachment('attachment')

    if (!attachment.name.endsWith('.pdf'))
      return await interaction.reply({ content: `Nur PDFs können hochgeladen werden! Versuche es erneut.`, ephemeral: true })

    try {
      await interaction.reply({ content: `Versuche Hochzuladen...`, ephemeral: true })
      klasse.downloadeAttachment(type, attachment.url, woche, jahr)
      await interaction.editReply({ content: `Hochgeladen!`, ephemeral: true })
    }
    catch (error) {
      console.log(error)
    }
  },
}
