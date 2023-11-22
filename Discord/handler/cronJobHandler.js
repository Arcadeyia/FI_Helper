const cron = require('node-cron')
const cj = require('consolji')
const schedule = require('./schedule.js')
const config = require('./config.js')

function initializeCronJobs(client) {
  cron.schedule('0 * * * *', () => {
    cj.log('Running Cron Job....')
    const cur_week = getCurrentWeek()
    console.log('Downloading Schedule...')

    Object.entries(config.classes).forEach(([className, classConfig]) => {
      schedule.downloadSchedules(className, cur_week, (path) => {
        client.channels.cache.get(classConfig.stundenplanChannelId).send({
          content: `New Schedule Available!`,
          files: [path],
        })
      })
    })

    cj.log('Cron Job Finished!')
  })
}

function getCurrentWeek() {
  const currentDate = new Date()
  const startDate = new Date(currentDate.getFullYear(), 0, 1)
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil(days / 7)

  return weekNumber
}

module.exports = initializeCronJobs
