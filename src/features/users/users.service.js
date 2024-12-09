import User from "./users.model.js";

const create = (data) => {
  return User(data).save();
};

const get = (options) => {
  return User.findOne(options);
};

const getUser = (id) => {
  return User.findById(id);
};

const removeUser = (id) => {
  return User.findByIdAndDelete(id); // Supprime l'utilisateur par son ID
};

const updateUser = (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export { create, get, getUser, removeUser, updateUser };
