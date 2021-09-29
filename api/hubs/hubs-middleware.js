const Hub = require('./hubs-model')

async function checkHubId (req, res, next) {
  // if id legit, next()
  // if id bad, next({ not found!!! })
  try {
    const hubMaybe = await Hub.findById()
  } catch (error) {
    next(error)
  }
}
