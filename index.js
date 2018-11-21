const { dialog } = require('electron')

let handler = false
let options = {}

exports.decorateConfig = config => {
  options = Object.assign({}, {
    title: 'Hyperを終了するよ？',
    message: '全部のセッションが終了するけどいい？',
    okButton: 'いいよ。',
    cancelButton: 'だめ。',
  }, config.hyperDialog)

  return config
}

exports.onApp = app => {
  if (handler)
    app.off('before-quit', handler)

  handler = showDialog(app, options)
  app.on('before-quit', handler)
}

function showDialog(app, options) {
  let quit = false

  return e => {
    if (!quit && app.getWindows().size) {
      e.preventDefault()

      dialog.showMessageBox({
        type: 'question',
        buttons: [options.okButton, options.cancelButton],
        defaultId: 0,
        title: options.title,
        message: options.title,
        detail: options.message
      }, i => {
        if (i === 0) {
          quit = true
          app.quit()
        }
      })
    }
  }
}
