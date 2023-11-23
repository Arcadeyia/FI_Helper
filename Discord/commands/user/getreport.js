const { CommandType } = require('@nyxb/commands');
const { ApplicationCommandOptionType } = require('discord.js');
const report = require('../../utils/report.js');
const config = require('../../utils/config.js');


module.exports = {
   category: 'Information',
   description: 'Receive Reports.',
   type: CommandType.BOTH,

   options: [
      {
         name: 'all',
         description: 'Get all available class reports',
         type: ApplicationCommandOptionType.Subcommand, // Stellen Sie sicher, dass dies korrekt ist
      },
      {
         name: 'week',
         description: 'Get class report from a specific week',
         type: ApplicationCommandOptionType.Subcommand,
         options: [
            {
               name: 'kw',
               description: 'The week you want to receive',
               type: ApplicationCommandOptionType.Integer, // Stellen Sie sicher, dass dies korrekt ist
               required: true,
            },
         ],
      },
   ],

   callback: ({ interaction, args }) => {
      let klassenName = '';

      // Logik zur Bestimmung des klassenName basierend auf Rollen
      Object.entries(config.classes).forEach(([_, klassenConfig]) => {
         if (interaction.member.roles.cache.has(klassenConfig.rollenId))
            klassenName = klassenConfig.klassenName;
      });

      if (!klassenName)
         return interaction.reply({ content: `You do not have a role associated with any class.`, ephemeral: true });

      const type = args.find(arg => arg.name === 'type').value;
      const week = args.find(arg => arg.name === 'week')?.value;

      if (type === 'all') {
         const report_packets = report.getAllReports(klassenName);
         report_packets.forEach((packet, index) => {
            interaction.user.send({ content: `All available Reports for ${klassenName}! ${index + 1}/${report_packets.length}`, files: packet });
         });
         return `Sending a DM with all Reports for ${klassenName}!`;
      }
      else if (type === 'week' && week !== undefined) {
         const report_files = report.getReportFromWeek(klassenName, week);
         if (report_files) {
            interaction.user.send({ content: `Reports for ${klassenName} from week ${week}`, files: report_files });
            return `Sending a DM with Reports for ${klassenName} for week ${week}.`;
         }
         else {
            return `No available Reports for ${klassenName} for week ${week}`;
         }
      }
   },
};
