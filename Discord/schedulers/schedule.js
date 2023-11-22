const fs = require('node:fs')
const https = require('node:https')
const crypto = require('node:crypto')
const config = require('./config.js')

function getAllSchedules(className) {
  const schedulePath = `Schedule/${className}/`
  const scheduleBatches = []
  let scheduleFiles = []
  let fileCount = 0

  fs.readdirSync(schedulePath).forEach((file) => {
    scheduleFiles.push(`${schedulePath}${file}`)
    fileCount++

    if (fileCount === 10) {
      fileCount = 0
      scheduleBatches.push(scheduleFiles)
      scheduleFiles = []
    }
  })

  if (scheduleFiles.length > 0)
    scheduleBatches.push(scheduleFiles)

  return scheduleBatches
}

function getScheduleFromWeek(className, week) {
  const currentYear = new Date().getFullYear()
  const schedulePaths = []

  for (let weekIndex = 1; weekIndex <= 20; weekIndex++) {
    const scheduleFilePath = `Schedule/${className}/KW${week}_${weekIndex}_${currentYear}.pdf`

    if (fs.existsSync(scheduleFilePath))
      schedulePaths.push(scheduleFilePath)

    else
      break
  }

  return schedulePaths.length === 0 ? false : schedulePaths
}

function downloadSchedules(className, week, callback) {
  const tempFilePath = `Schedule/${className}/temp.pdf`
  const currentYear = new Date().getFullYear()
  const url = `${config.baseUrl}${className}_${currentYear}_abKW${week}.pdf`

  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      console.log('File not found')
      return
    }

    response.pipe(fs.createWriteStream(tempFilePath))
      .on('finish', () => {
        console.log(`Finished Download for ${className}, Comparing....`)
        compareSchedules(className, week, tempFilePath, callback)
      })
  })
}

function compareSchedules(className, week, tempFilePath, callback) {
  const currentYear = new Date().getFullYear()
  let existingFilePath = ''
  let newFilePath = ''

  for (let fileIndex = 1; fileIndex <= 4; fileIndex++) {
    newFilePath = `Schedule/${className}/KW${week}_${fileIndex}_${currentYear}.pdf`

    if (!fs.existsSync(newFilePath)) {
      existingFilePath = newFilePath
      break
    }
  }

  if (existingFilePath && (getHash(existingFilePath) !== getHash(tempFilePath))) {
    console.log('Different hash, saving...')
    fs.rename(tempFilePath, existingFilePath, (err) => {
      if (err)
        console.error(err)
      callback(existingFilePath)
    })
  }
  else {
    console.log('Same Hash, Deleting Temp File...')
    fs.unlink(tempFilePath, (err) => {
      if (err)
        console.error(err)
      else console.log('Temp File Deleted!')
    })
  }
}

function getHash(file) {
  const hashSum = crypto.createHash('sha256')
  const fileBuffer = fs.readFileSync(file)
  hashSum.update(fileBuffer)
  return hashSum.digest('hex')
}

module.exports = { getAllSchedules, getScheduleFromWeek, downloadSchedules, compareSchedules }
