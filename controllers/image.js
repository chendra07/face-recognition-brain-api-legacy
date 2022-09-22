import fetch from "node-fetch";

const HandleClarifaiApiCall = (req, res) => {
  const MODEL_ID = "face-detection";
  const raw = JSON.stringify({
    user_app_id: {
      user_id: process.env.CLARIFAI_USER_ID,
      app_id: process.env.CLARIFAI_APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: req.body.imageUrl,
          },
        },
      },
    ],
  });

  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + process.env.CLARIFAI_API_KEY,
    },
    body: raw,
  })
    .then((imageResp) => imageResp.json())
    .then((data) => res.json(data));
};

const incrementUserEntries = (req, res, db) => {
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
  incrementUserEntries,
  HandleClarifaiApiCall,
};
