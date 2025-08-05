import connectMongo from "../lib/connectMongo";
import User from "../models/User";

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === "GET") {
    const users = await User.find();
    return res.status(200).json(users);
  }

  if (req.method === "POST") {
    const newUser = await User.create(req.body);
    return res.status(201).json(newUser);
  }
}
