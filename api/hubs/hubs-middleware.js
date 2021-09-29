const Hub = require('./hubs-model')

async function checkHubId (req, res, next) {
  // if id legit, next()
  // if id bad, next({ not found!!! })
  try {

  } catch (error) {
    next(error)
  }
}
