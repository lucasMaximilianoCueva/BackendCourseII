import mongoose from "mongoose";
const user = new mongoose.Schema({
  username: String,
  password: String,
  username: String,
  email: String,
  name: String,
  lastname: String,
  adress: String,
  age: Number,
  phone: Number,
  password: String,
  avatar: {data: Buffer, contentType: String}
});
 
const User = mongoose.model("User", user);

export default User;