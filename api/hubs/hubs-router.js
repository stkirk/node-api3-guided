const express = require("express");

const Hubs = require("./hubs-model.js");
const Messages = require("../messages/messages-model.js");

const router = express.Router();

//validate id before making multiple database calls
// all endpoints that take an :id param do very similar validation of that id and can all be replaced by this one piece of custom middleware
// add this middleware as an argument after the string containing the endpoint path on all endpoints that need their id checked
const checkHubId = async (req, res, next) => {
  console.log("Verifying id...");
  try {
    const { id } = req.params;
    const hub = await Hubs.findById(id);
    if (hub) {
      req.hub = hub; //hi-jack req object and creates a new property inside of it to take to the next piece of middleware as validation
      // stops unneccessary second query to database
      next(); //request proceeds
    } else {
      //will shoot back an error in the event of id not in database
      //request is short-circuited --> error-handling middleware takes care of response to the client
      next({ status: 404, message: `no hub with id ${id} found` });
    }
  } catch (err) {
    next(err);
  }
};

const checkHubPayload = (req, res, next) => {
  //req.body is legit call next
  if (req.body.name) {
    //happy path
    next();
  } else if (req.body.name < 3) {
    next({ status: 422, message: "name must have at least 3 chars" });
  } else {
    next({ status: 422, message: "supply valid name for new hub" });
  }
  //otherwise call next and supply it with the err as an argument
};

const checkHubMessage = (req, res, next) => {
  if (!req.body.text || !req.body.sender) {
    res.status(400).json("text and sender required");
  } else {
    next();
  }
};

router.get("/", (req, res, next) => {
  Hubs.find(req.query)
    .then((hubs) => {
      res.status(200).json(hubs);
    })
    .catch((error) => {
      next(error); //use next to send the error object over to our catchall error handling middleware at the end of the server file
    });
});

//add middleware to all endpoints with :id so that you only touch the database if we KNOW the id is good
router.get("/:id", checkHubId, (req, res) => {
  // use hub property we put on req in checkHubId
  res.status(200).json(req.hub);

  //  ALL OF THIS NO LONGER NEEDED BECAUSE OF checkHubId middleware!!!!!
  // Hubs.findById(req.params.id)
  //   .then((hub) => {
  //     if (hub) {
  //       res.status(200).json(hub);
  //     } else {
  //       res.status(404).json({ message: "Hub not found" });
  //     }
  //   })
  //   .catch((error) => {
  //     // log error to server
  //     console.log(error);
  //     res.status(500).json({
  //       message: "Error retrieving the hub",
  //     });
  //   });
});

router.post("/", checkHubPayload, (req, res, next) => {
  Hubs.add(req.body)
    .then((hub) => {
      res.status(201).json(hub);
    })
    .catch(next); //same as above, just a cleaner way without wrapping next in the anonymous function where 'error' is passed into it
  // when the Promise is rejected and catch block is triggered, next is called and the framework knows to pass the 'error' object into it
});

router.delete("/:id", checkHubId, (req, res, next) => {
  Hubs.remove(req.params.id)
    //conditional logic used to make sure Hubs.remove returns a count (successfully deleted 'count' entries), is abstracted away to checkHubId because we know count will be 1 if the id exists!!!!!
    .then(() => {
      res.status(200).json({ message: "The hub has been nuked" });
    })
    .catch(next);
});

router.put("/:id", checkHubId, checkHubPayload, (req, res, next) => {
  Hubs.update(req.params.id, req.body)
    .then((hub) => {
      res.status(200).json(hub);
    })
    .catch(next);
});

//Same endpoint as above using TRY/CATCH
router.put("/:id", checkHubId, checkHubPayload, async (req, res, next) => {
  try {
    const updatedHub = await Hubs.update(req.hub.id, req.body); //checkHubById gave us req.hub so you can use that here as an argument for the update method instead of params
    res.status(200).json(updatedHub);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/messages", checkHubId, (req, res, next) => {
  Hubs.findHubMessages(req.params.id)
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch(next);
});

//can add as many pieces of middleware as arguments as you want
// since same endpoint, this won't be reached because it comes second
router.post("/:id/messages", checkHubId, checkHubMessage, (req, res, next) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Messages.add(messageInfo)
    .then((message) => {
      res.status(210).json(message);
    })
    .catch(next);
});

module.exports = router;
