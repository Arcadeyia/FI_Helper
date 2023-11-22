const fs = require('node:fs')
const https = require('node:https')
const crypto = require('node:crypto')
const config = require('./config.js')

function getAllSchedules(class_name) {
  const path = `Schedule/${class_name}/`
  const packet = []
  let paths = []
  let count = 0
  fs.readdirSync(path).forEach((file) => {
    paths.push(`Schedule/${class_name}/${file}`)
    count++
    if (count === 10) {
      count = 0
      packet.push(paths)
      paths = []
    }
  })
  packet.push(paths)
  return packet
}

function getScheduleFromWeek(class_name, week) {
  const year = new Date().getFullYear()
  const paths = []
  for (let i = 1; i <= 20; i++) {
    const path = `Schedule/${class_name}/KW${week}_${i}_${year}.pdf`
    if (fs.existsSync(path))
      paths.push(path)

    else
      break
  }
  return paths.length === 0 ? false : paths
}

function downloadSchedules(class_name, week, callback) {
  const file = fs.createWriteStream(`Schedule/${class_name}/temp.pdf`)
  const year = new Date().getFullYear()
  const url = `${config.baseUrl}${class_name}_${year}_abKW${week}.pdf`

  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      console.log('File not found')
      return
    }

    response.pipe(file)
    file.on('finish', () => {
      file.close()
      console.log(`Finished Download for ${class_name}, Comparing....`)
      compareSchedules(class_name, week, callback)
    })
  })
}

function compareSchedules(class_name, week, callback) {
  const year = new Date().getFullYear()
  const temp_file = `Schedule/${class_name}/temp.pdf`
  let old_file = ''
  let path = ''
  let i

  for (i = 1; i <= 4; i++) {
    path = `Schedule/${class_name}/KW${week}_${i}_${year}.pdf`
    if (fs.existsSync(path))
      old_file = path

    else
      break
  }

  if (i !== 1) {
    if (getHash(old_file) !== getHash(temp_file)) {
      console.log('Different hash, saving...')
      fs.rename(temp_file, path, (err) => {
        if (err)
          console.error(err)
        callback(path)
      })
    }
    else {
      console.log('Same Hash, Deleting Temp File...')
      fs.unlink(temp_file, (err) => {
        if (err)
          console.error(err)
        else console.log('Temp File Deleted!')
      })
    }
  }
  else {
    console.log('Schedule for the week doesn’t exist! Saving...')
    fs.rename(temp_file, path, (err) => {
      if (err)
        console.error(err)
      callback(path)
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
