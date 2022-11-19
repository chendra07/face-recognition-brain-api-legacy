const handleSignIn = (req, res, db, comparePassword) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      loginStatus: "failed",
      message: "incorrect submission",
    });
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = comparePassword(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json({
              loginStatus: "success",
              ...user[0],
            });
          })
          .catch((error) => {
            console.log(error);
            res
              .status(400)
              .json({ loginStatus: "failed", message: "Unable to get user" });
          });
      } else {
        res
          .status(400)
          .json({ loginStatus: "failed", message: "wrong credentials" });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ loginStatus: "failed", message: "internal server error" });
    });
};

module.exports = {
  handleSignIn,
};
