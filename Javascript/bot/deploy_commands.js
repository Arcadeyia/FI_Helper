const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')
const { REST, Routes, Collection } = require('discord.js')

//Registrierung der Commands in die Discord API
function registerCommands(client) {
  client.commands = new Collection()
  const commands = []
  // Grab all the command files from the commands directory you created earlier
  const foldersPath = path.join(`${process.cwd()}/Javascript/commands`)
  const commandFolders = fs.readdirSync(foldersPath)

  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file)
      const command = require(filePath)
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command)
        commands.push(command.data.toJSON())
      }
      else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
      }
    }
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(process.env.TOKEN)

  rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);

  // and deploy your commands!
  (async () => {
    try {
      console.log(`Started refreshing ${commands.length} application (/) commands.`)

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(
        // Routes.applicationCommands(process.env.CLIENT_ID),
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands },
      )

      console.log(`Successfully reloaded ${data.length} application (/) commands.`)
    }
    catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error)
    }
  })()
}

module.exports = registerCommands
