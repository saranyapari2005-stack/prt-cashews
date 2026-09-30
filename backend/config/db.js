import mongoose from "mongoose";

export const connect_db = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log("mongodb connected with server", data.connection.host);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
