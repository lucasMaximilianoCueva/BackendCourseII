import { prodFaker } from "../db/prodFaker.js";
import { fork } from "child_process";

async function getFakeProdsController(req, res) {
  const { id } = req.params;
  if (id) {
    res.json(prodFaker.listById(id));
  } else {
    prodFaker.populate(req.query.q);
    res.json(prodFaker.list());
  }
}

async function getRandomDataController(req, res) {
  const quantity = req.query.quan || 100000000;
  const forked = fork("./helpers/number.js");
  setTimeout(() => {
    forked.send(quantity);
  }, 1000);
  forked.on("message", (calc) => {
    res.json({ randoms: calc });
  });
}

export {
  getFakeProdsController,
  getRandomDataController,
};
