const response = require("../../../utils/responses");
const db = require("../../../models/database");
const { comparePassword, hashPassword } = require("../../../utils/password");

const httpPostSignIn = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return response.res400(req, res, {
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
            return response.res200(req, res, {
              loginStatus: "success",
              ...user[0],
            });
          })
          .catch((error) => {
            console.log(error);
            return response.res400(req, res, {
              loginStatus: "failed",
              message: "Unable to get user",
            });
          });
      } else {
        return response.res400(req, res, {
          loginStatus: "failed",
          message: "wrong credentials",
        });
      }
    })
    .catch((error) => {
      console.error("(signin): ", error);

      return response.res500(req, res, {
        loginStatus: "failed",
        message: "internal server error, try again later",
      });
    });
};

const httpPostRegister = (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !name || !password) {
    return response.res400(req, res, {
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
          .then(trx.commit)
          .then((newUser) => {
            return response.res200(req, res, {
              loginStatus: "success",
              ...newUser[0],
            });
          })
          .catch((error) => {
            console.error("(register): ", error);
            trx.rollback;
            return response.res400(req, res, {
              registerStatus: "failed",
              message: "unable to register",
            });
          });
      })
      .catch((error) => {
        console.error("(register): ", error);
        return response.res400(req, res, {
          registerStatus: "failed",
          message: "unable to register",
        });
      });
  });
};

const httpGetProfile = (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length >= 1) {
        return response.res200(req, res, { user: user[0] });
      } else {
        return response.res400(req, res, { message: "user not found" });
      }
    })
    .catch((error) => {
      console.error("(profile): ", error);
      return response.res500(req, res, { message: "internal server error" });
    });
};

module.exports = {
  httpPostSignIn,
  httpPostRegister,
  httpGetProfile,
};
