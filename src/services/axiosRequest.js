/* eslint-disable no-undef */
const axios = require("axios");

const renderHeaders = async (uploadFile) => {
  return {
    "Content-Type": uploadFile ? "multipart/form-data" : "application/json",
  };
};

async function Get(baseUrl, path, request) {
  const headers = await renderHeaders();
  const req = [];
  if (request) {
    Object.keys(request).forEach((item) => {
      req.push(`${[item]}=${request[item]}`);
    });
  }

  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      baseURL: process.env.REACT_APP_API_URL ?? baseUrl,
      url: `${path}?${req.join("&") || ""}`,
      headers,
    })
      .then((resp) => {
        resolve(resp);
      })
      .catch((error) => {
        reject(`(GET) error: ${error}`);
      });
  });

  return promise;
}

async function Post(baseUrl, path, request, uploadFile) {
  const headers = await renderHeaders(uploadFile);
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "post",
      baseURL: process.env.REACT_APP_API_URL ?? baseUrl,
      url: path,
      data: request,
      headers,
    })
      .then((resp) => {
        resolve(resp);
      })
      .catch((error) => {
        reject(`(POST) error: ${error}`);
      });
  });
  return promise;
}

async function Put(baseUrl, path, request) {
  const headers = await renderHeaders();
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "put",
      baseURL: process.env.REACT_APP_API_URL && baseUrl,
      url: path,
      data: request,
      headers,
    }).then(
      (resp) => {
        resolve(resp);
      },
      (error) => {
        reject(`(PUT) error: ${error}`);
      }
    );
  });
  return promise;
}

async function Delete(baseUrl, path, request) {
  const headers = await renderHeaders();
  const req = [];

  if (request) {
    Object.keys(request).forEach((item) => {
      req.push(`${[item]}=${request[item]}`);
    });
  }

  const promise = new Promise((resolve, reject) => {
    axios({
      method: "delete",
      baseURL: process.env.REACT_APP_API_URL ?? baseUrl,
      url: `${path}?${req.join("&") || ""}`,
      headers,
    }).then(
      (res) => {
        resolve(res);
      },
      (error) => {
        reject(`(DELETE) error: ${error}`);
      }
    );
  });
  return promise;
}

module.exports = {
  Get,
  Post,
  Put,
  Delete,
};
