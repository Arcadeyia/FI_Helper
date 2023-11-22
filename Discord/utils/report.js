const fs = require('node:fs')

function getAllReports(class_name) {
  const path = `Report/${class_name}/`
  packet = []
  paths = []
  count = 0
  fs.readdirSync(path).forEach((file) => {
    paths.push(`Report/${class_name}/${file}`)
    count++
    if (count == 10) {
      count = 0
      packet.push(paths)
      paths = []
    }
  })
  packet.push(paths)
  return packet
}
function getReportFromWeek(class_name, week) {
  const year = new Date().getFullYear()
  paths = []
  for (let i = 1; i <= 20; i++) {
    path = `Report/${class_name}/KW${week}_${i}_${year}.pdf`
    if (fs.existsSync(path))
      paths.push(path)

    else
      break
  }
  if (paths.length == 0)
    return false

  else
    return paths
}

module.exports = { getAllReports, getReportFromWeek }
