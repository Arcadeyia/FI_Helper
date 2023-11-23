const fs = require('fs');

function getAllReports(klassenName) {
   const reportPath = `Berichte/${klassenName}/`;
   const reportPackets = [];
   let reportFiles = [];
   let fileCount = 0;

   fs.readdirSync(reportPath).forEach((file) => {
      reportFiles.push(`${reportPath}${file}`);
      fileCount++;

      if (fileCount === 10) {
         fileCount = 0;
         reportPackets.push(reportFiles);
         reportFiles = [];
      }
   });

   // Fügen Sie die verbleibenden Dateien zum letzten Paket hinzu, falls vorhanden
   if (reportFiles.length > 0)
      reportPackets.push(reportFiles);

   return reportPackets;
}

function getReportFromWeek(klassenName, week) {
   const currentYear = new Date().getFullYear();
   const reportPaths = [];

   for (let weekIndex = 1; weekIndex <= 20; weekIndex++) {
      const reportPath = `Berichte/${klassenName}/KW${week}_${weekIndex}_${currentYear}.pdf`;

      if (fs.existsSync(reportPath))
         reportPaths.push(reportPath);
      else
         break;
   }

   return reportPaths.length === 0 ? false : reportPaths;
}

module.exports = { getAllReports, getReportFromWeek };
