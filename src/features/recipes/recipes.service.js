import recipes from "./recipes.model.js";

const create = (data, id) => {
  return recipes({ ...data, createdBy: id }).save();
};

const getUsersrecipes = (id) => {
  return recipes.find({ createdBy: id });
};

const get = (id) => {
  return recipes.findById(id);
};

const update = (id, data) => {
  return recipes.findByIdAndUpdate(id, data, {
    new: true,
  });
};

const getAll = () => {
  return recipes.find(); // Fetch all recipes
};

const remove = (id) => {
  return recipes.findByIdAndDelete(id);
};

const removeByUserId = (userId) => {
  return recipes.deleteMany({ createdBy: userId }); // Supprime toutes les recettes associées à cet utilisateur
};

export { create, getUsersrecipes, get, update, getAll, remove, removeByUserId };
