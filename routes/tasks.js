const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

router.use(auth);

router.post("/", async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.user.id });
  res.json(task);
});

router.get("/", async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

router.get("/stats", async (req, res) => {
  const stats = await Task.aggregate([
    { $match: { userId: req.user.id } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  res.json(stats);
});

module.exports = router;
