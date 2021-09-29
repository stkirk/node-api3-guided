const yup = require('yup')
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

const hubSchema = yup.object().shape({
  name: yup
    .string()
    .typeError('name must be a string')
    .trim('only whitespace bad')
    .required('name is required')
    .min(3, 'name must be 3 chars long')
    .max(10, 'name should be 10 chars tops')
})

async function validateHub(req, res, next) {
  try {
    const validated = await hubSchema.validate(
      req.body
    )
  } catch (err) {
    next({ status: 422, message: err.message })
  }
}

// function validateHub(req, res, next) {
//   // if req.body legit next()
//   // if req.body sucks next({ body sucks })
//   const { name } = req.body
//   if (!name || typeof name !== 'string' || !name.trim()) {
//     next({ code: 400, message: 'name required' })
//   } else {
//     next()
//   }
// }

module.exports = {
  checkHubId,
  validateHub,
}
