const fs = require('node:fs')
const crypto = require('node:crypto')
const https = require('node:https')
const cj = require('consolji')
const config = require('../utils/config.js')

async function getAllSchedules(klassenName) {
  const schedulePath = `data/Stundenplan/${klassenName}/`
  const scheduleBatches = []
  let scheduleFiles = []
  let fileCount = 0

  try {
    const files = await fs.readdir(schedulePath)
    for (const file of files) {
      scheduleFiles.push(`${schedulePath}${file}`)
      fileCount++
      if (fileCount === 10) {
        scheduleBatches.push(scheduleFiles)
        scheduleFiles = []
        fileCount = 0
      }
    }
    if (scheduleFiles.length > 0)
      scheduleBatches.push(scheduleFiles)

    return scheduleBatches
  }
  catch (err) {
    console.error(`Error getting all schedules: ${err}`)
    throw err
  }
}

async function getScheduleFromWeek(klassenName, week) {
  const currentYear = new Date().getFullYear()
  const schedulePaths = []
  for (let weekIndex = 1; weekIndex <= 20; weekIndex++) {
    const scheduleFilePath = `data/Stundenplan/${klassenName}/KW${week}_${weekIndex}_${currentYear}.pdf`
    try {
      await fs.promises.access(scheduleFilePath)
      schedulePaths.push(scheduleFilePath)
    }
    catch {
      break
    }
  }
  return schedulePaths.length === 0 ? false : schedulePaths
}

function downloadSchedules(klassenName, week) {
  const tempFilePath = `data/Stundenplan/${klassenName}/temp.pdf`
  const currentYear = new Date().getFullYear()
  const urlPath = config.klassen[klassenName].urlPath || klassenName
  const url = `${config.baseUrl}${urlPath}_${currentYear}_abKW${week}.pdf`

  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(tempFilePath)
        response.pipe(fileStream)
        fileStream.on('finish', () => {
          fileStream.close()
          compareSchedules(klassenName, week, tempFilePath).then((resolvedPath) => {
            resolve(resolvedPath)
            cj.log(`Heruntergeladener Stundenplan für ${klassenName} für Woche ${week}`)
          }).catch(reject)
        })
      }
      else {
        cj.log(`Anfrage fehlgeschlagen: ${response.statusCode}`)
        response.resume()
        reject(new Error(`Anfrage fehlgeschlagen: ${response.statusCode}`))
      }
    })

    request.on('error', (err) => {
      console.error(`Fehler beim Herunterladen von Stundenplänen: ${err}`)
      reject(err)
    })
  })
}

async function compareSchedules(klassenName, week, tempFilePath) {
  const currentYear = new Date().getFullYear()
  let existingFilePath = ''

  for (let fileIndex = 1; fileIndex <= 4; fileIndex++) {
    const possiblePath = `data/Stundenplan/${klassenName}/KW${week}_${fileIndex}_${currentYear}.pdf`
    try {
      await fs.promises.access(possiblePath)
      existingFilePath = possiblePath
    }
    catch {
      if (!existingFilePath)
        existingFilePath = possiblePath
    }
  }

  if (!existingFilePath)
    existingFilePath = `data/Stundenplan/${klassenName}/KW${week}_1_${currentYear}.pdf`

  const tempHash = await getHash(tempFilePath)
  try {
    const existingHash = await getHash(existingFilePath)
    if (existingHash !== tempHash) {
      cj.log('Unterschiedlicher hash, speichere neuen Stundenplan...')
      await fs.promises.rename(tempFilePath, existingFilePath)
      return existingFilePath
    }
    else {
      cj.log('Keine Änderungen festgestellt. Lösche die temporäre Datei...')
      await fs.promises.unlink(tempFilePath)
      return null
    }
  }
  catch {
    cj.log('Vorhandene Datei nicht gefunden oder anderer Fehler, Speichern eines neuen Stundenplans...')
    await fs.promises.rename(tempFilePath, existingFilePath)
    return existingFilePath
  }
}

async function getHash(filePath) {
  try {
    const data = await fs.promises.readFile(filePath)
    const hashSum = crypto.createHash('sha256')
    hashSum.update(data)
    return hashSum.digest('hex')
  }
  catch (err) {
    console.error(`Error getting hash for file ${filePath}: ${err}`)
    throw err
  }
}

module.exports = {
  getAllSchedules,
  getScheduleFromWeek,
  downloadSchedules,
  compareSchedules,
  getHash,
}
