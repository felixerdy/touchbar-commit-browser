require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = require('url')
const path = require('path')

const {app, BrowserWindow, TouchBar, ipcMain} = require('electron')

const {TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarColorPicker, TouchBarSlider} = TouchBar

let commits = []
let index = 0

const tbDateLabel = new TouchBarLabel({
  label: 'Date',
  textColor: '#a0aacc'
})

const tbAuthorLabel = new TouchBarLabel({
  label: 'Author',
  textColor: '#ffffff'
})

const tbMsgLabel = new TouchBarLabel({
  label: 'Commit message'
})

const tbLeftButton = new TouchBarButton({
  label: '‹',
  click: () => {
    if(index !== 0) {
      index -= 1
      setCommitLabels()
    }
  }
})

const tbRightButton = new TouchBarButton({
  label: '›',
  click: () => {
    if(index !== commits.length-1) {
      index += 1
      setCommitLabels()
    }
  }
})

const touchBar = new TouchBar([
  tbLeftButton,
  tbRightButton,
  tbDateLabel,
  tbAuthorLabel,
  tbMsgLabel
])

let window

app.once('ready', () => {
  window = new BrowserWindow({
    width: 370, height: 120
  })
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  window.setTouchBar(touchBar)
})

function setCommitLabels() {
  tbAuthorLabel.textColor = '#ffffff'
  commitDate = new Date(commits[index].commit.author.date)
  tbDateLabel.label = commitDate.toLocaleString()
  tbAuthorLabel.label = commits[index].commit.author.name
  tbMsgLabel.label = commits[index].commit.message
}

ipcMain.on('repoURLUpdate', (event, arg) => {
  fetch(`https://api.github.com/repos/${arg.repoOwner}/${arg.repoName}/commits`)
  .then(response => {
    return response.json();
  })
  .then(json => {
    commits = json
    index = 0
    setCommitLabels()
  }).catch(ex => {
    console.log('parsing failed', ex)
    commitDate = new Date()
    tbDateLabel.label = commitDate.toLocaleString()
    tbAuthorLabel.label = 'ERROR'
    tbAuthorLabel.textColor = '#ff0022'
    tbMsgLabel.label = ex.toString()
  })
})
