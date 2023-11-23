const fs = require('node:fs/promises')
const path = require('node:path')
const process = require('node:process')
const cj = require('consolji')

async function createFolders(klassenName) {
  const path_stundenplan = path.join(process.cwd(), 'data', 'Stundenplan', klassenName)
  const path_berichte = path.join(process.cwd(), 'data', 'Berichte', klassenName)

  try {
    await fs.mkdir(path_stundenplan, { recursive: true })
    await fs.mkdir(path_berichte, { recursive: true })
    cj.log(`Created folders for ${klassenName}`)
  }
  catch (err) {
    console.error(`Error creating directories for ${klassenName}:`, err)
  }
}

module.exports = createFolders
