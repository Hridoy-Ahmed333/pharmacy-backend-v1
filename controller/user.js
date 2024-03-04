const fs = require("fs");
const mongoose = require("mongoose");
const model = require("../model/user");
const User = model.User;

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
exports.GetOneUser = async (req, res) => {
  const id = req.params.id;
  try {
    const users = await User.findById(id);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
exports.replaceUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOneAndReplace({ _id: id }, req.body, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOneAndDelete({ _id: id });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
