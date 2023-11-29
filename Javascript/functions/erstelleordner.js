const fs = require('node:fs')

function erstelleordner(class_name) {
  const path_schedule = `Schedule/${class_name}`
  const path_report = `Report/${class_name}`
  if (!fs.existsSync(path_schedule)) {
    console.log(`Path for ${class_name} Schedules does not exist! Creating...`)
    fs.mkdirSync(path_schedule, { recursive: true })
  }

  if (!fs.existsSync(path_report)) {
    console.log(`Path for ${class_name} Reports does not exist! Creating...`)
    fs.mkdirSync(path_report, { recursive: true })
  }
}

module.exports = erstelleordner
