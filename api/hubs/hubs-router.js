const express = require('express');
const { checkHubId, validateHub } = require('./hubs-middleware')
const Hubs = require('./hubs-model.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();

router.get('/', (req, res, next) => {
  Hubs.find(req.query)
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(error => {
      // unnecessary function wrapping in this case
      next(error); // you do it like this when try/catch
    });
});

router.get('/:id', checkHubId, (req, res) => {
  res.status(200).json(req.hub)
});

router.post('/', validateHub, (req, res, next) => {
  Hubs.add(req.body)
  .then(hub => {
    res.status(201).json(hub);
  })
  .catch(next);
});

router.delete('/:id', checkHubId, (req, res, next) => {
  Hubs.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'The hub has been nuked' });
    })
    .catch(next);
});

router.put('/:id', checkHubId, (req, res, next) => {
  Hubs.update(req.params.id, req.body)
    .then(hub => {
      res.status(200).json(hub);
    })
    .catch(next);
});

router.get('/:id/messages', checkHubId, (req, res, next) => {
  Hubs.findHubMessages(req.params.id)
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(next);
});

router.post('/:id/messages', checkHubId, (req, res, next) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };
  Messages.add(messageInfo)
    .then(message => {
      res.status(210).json(message);
    })
    .catch(next);
});

module.exports = router;
