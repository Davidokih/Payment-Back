import mongoose from "mongoose";

const URL: string = "mongodb://localhost/wallet";
mongoose
  .connect(URL)
  .then(() => {
    console.log("Database now connected");
  })
  .catch((err) => console.log(err));

export default mongoose;
