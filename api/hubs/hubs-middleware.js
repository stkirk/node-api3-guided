const Hub = require('./hubs-model')

async function checkHubId (req, res, next) {
  // if id legit, next()
  // if id bad, next({ not found!!! })
  try {
    const hubMaybe = await Hub.findById(req.params.id)
    if (hubMaybe) {
      req.hub = hubMaybe
      next()
    } else {
      next({ status: 404, message: 'not found!!!' })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  checkHubId,
}
