const getImagePosition = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where({ id: id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json({ entries: entries[0].entries }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    });
};

export default {
  getImagePosition,
};
