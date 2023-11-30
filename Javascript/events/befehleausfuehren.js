const { Events } = require('discord.js')
// Registriere Commandhandler - Sorgt dafür das die "execute" funktion in den Commands ausgeführt wird.
function befehleausfuehren(client, klassenliste) {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand())
      return

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      let has_role = false
      for (const klasse in klassenliste) {
        if (interaction.member.roles.cache.has(klassenliste[klasse].cfg.rolenID)) {
          has_role = true
          await command.execute(interaction, client, klassenliste[klasse])
          break
        }
      }

      if (!has_role)
        await interaction.reply({ content: 'Keine Klassen Rolle vorhanden!', ephemeral: true })
    }
    catch (error) {
      console.error(error)
      if (interaction.replied || interaction.deferred)
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })

      else
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
  })
}

module.exports = befehleausfuehren
