const crypto = require('node:crypto')
const fs = require('node:fs')
// Vergleicht Hashwerte
function vergleicheHash(d1, d2) {
  // Wenn hash nicht gleich...
  if (hash(d1) === hash(d2))
    return true

  return false
}

// Gibt den Hashwert einer datei wieder
function hash(datei) {
  const hashSum = crypto.createHash('sha256')
  const fileBuffer = fs.readFileSync(datei)
  hashSum.update(fileBuffer)
  const hex = hashSum.digest('hex')
  return hex
}

module.exports = vergleicheHash
