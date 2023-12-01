const cron = require('node-cron')
const woche = require('../functions/woche')

// Plane Cronjobs der momentanen und nächsten Woche
function cronjob(client, klassenliste) {
  cron.schedule('0,30 6-20 * * 1-5', () => {
    // Setzte das jetzige Jahr
    const jahr = new Date().getFullYear()
    console.log(`${client.user.username} Starte Cronjob...`)
    // Für jede Klasse in der Liste
    for (const klasse in klassenliste)
    // Führe Klassenfunktion aus
      klassenliste[klasse].downloadeStundenplan(woche(), jahr)
  })

  cron.schedule('15,45 8-20 * * 5', () => {
    // Setzte das jetzige Jahr
    const jahr = new Date().getFullYear()
    console.log(`${client.user.username} Starte Cronjob...`)
    console.log('Downloading Schedule...')
    // Für jede Klasse in der Liste
    for (const klasse in klassenliste)
      // Führe Klassenfunktion aus
      klassenliste[klasse].downloadeStundenplan(woche() + 1, jahr)
  })
}

module.exports = cronjob
