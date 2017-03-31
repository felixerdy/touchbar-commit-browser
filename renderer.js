const {ipcRenderer} = require('electron')

function sendOwnerAndName() {
  var repoOwner = document.getElementById("repoOwnerInput").value;
  var repoName = document.getElementById("repoNameInput").value;

  ipcRenderer.send('repoURLUpdate', {
    repoOwner: repoOwner,
    repoName: repoName
  })
}

document.getElementById("goButton").addEventListener("click", sendOwnerAndName)
