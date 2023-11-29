const { Events } = require('discord.js')

function befehleausfuehren(client) {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand())
      return

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      // when nicht in einer klasse error--
      await command.execute(interaction, client)
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
