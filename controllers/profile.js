const getProfile = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length >= 1) {
        res.json(user[0]);
      } else {
        res.status(400).json({ message: "user not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    });
};

export default {
  getProfile,
};
