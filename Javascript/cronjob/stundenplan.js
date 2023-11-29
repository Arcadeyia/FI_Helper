const cron = require('node-cron')

cron.schedule('0 * * * *', () => {
  console.log('Running Cron Job....')
  console.log('Downloading Schedule...')

  // für jede klasse download stundenplan...
})
