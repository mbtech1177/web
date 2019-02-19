const showLoader = () => document.getElementById("loading").style.display = ''
const hideLoader = () => document.getElementById("loading").style.display = 'none'

const printOutput = (output) =>
  document.getElementById("output").innerText = String(output)

const printLog = line =>
  document.getElementById("log").innerHTML += `<br>`
    + `${String(line)}`
