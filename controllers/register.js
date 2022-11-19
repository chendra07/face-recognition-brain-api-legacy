const handleRegsiter = (req, res, db, hashPassword) => {
  // console.log("Bodyyyyyyy: ", req.body);
  const { email, password, name } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({
      registerStatus: "failed",
      message: "incorrect submission",
    });
  }
  // console.log("hash: ", hashPassword(password));
  db.transaction((trx) => {
    let hash = hashPassword(password);
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*") //return all data from column
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((newUser) => {
            res.json({
              registerStatus: "success",
              ...newUser[0],
            });
          })
          .then(trx.commit)
          .catch((error) => {
            console.log(error);
            res.status(400).json({
              registerStatus: "failed",
              message: "unable to register",
            });
            trx.rollback;
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({
          registerStatus: "failed",
          message: "unable to register",
        });
      });
  });
};

module.exports = { handleRegsiter };
