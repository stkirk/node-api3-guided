const Hub = require('./hubs-model')

async function checkHubId(req, res, next) {
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

function validateHub(req, res, next) {
  // if req.body legit next()
  // if req.body sucks next({ body sucks })
  try {
    if (req.body.name && req.body.name.trim()) {
      next()
    } else {
      next({ status: 404, message: `No body!` })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  checkHubId,
  validateHub,
}
