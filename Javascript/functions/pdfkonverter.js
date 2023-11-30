const fs = require('node:fs')
const process = require('node:process')
const { fromPath } = require("pdf2pic");

function pdfKonverter(file, name) {
  const dir = `${process.cwd()}/Javascript`

  const options = {
    density: 100,
    saveFilename: name,
    savePath: dir,
    format: "png",
  };
  const convert = fromPath(file, options);
  const pageToConvertAsImage = 1;

  return new Promise((myResolve, myReject) => {
    convert(pageToConvertAsImage, { responseType: "image" })
      .then((resolve) => {
        console.log(`Erfolgreich Konvertiert:${file}`);
        myResolve(resolve.path)
      });

  })
}
module.exports = pdfKonverter
