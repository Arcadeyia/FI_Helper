const cron = require('node-cron')
const cj = require('consolji')
const schedule = require('./schedule.js')
const settings = require('./settings.json')

function initializeCronJobs(client) {
  cron.schedule('0 * * * *', () => {
    cj.log('Running Cron Job....')
    const cur_week = getCurrentWeek()
    console.log('Downloading Schedule...')

    for (const role_id in settings.roles) {
      const class_name = settings.roles[role_id]
      schedule.downloadSchedules(class_name, cur_week, (path) => {
        client.channels.cache.get(settings.channels.schedule[role_id]).send({
          content: `New Schedule Available!`,
          files: [path],
        })
      })
    }

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
