const logQuote = (coin) => (req, res, next) => {
  if (
    coin == "penny" ||
    coin == "dime" ||
    coin == "nickel" ||
    coin == "quarter"
  ) {
    console.log(`A ${coin} saved is a ${coin} not enjoyed!`);
  } else {
    res.json("not a valid coin");
  }
  next();
};

const checkWord = (req, res, next) => {
  if (req.query && req.query.word == "turd") {
    res.json(`You can't proceed ${req.query.word} is naughty`);
  } else {
    next();
  }
};

module.exports = {
  logQuote,
  checkWord,
};
