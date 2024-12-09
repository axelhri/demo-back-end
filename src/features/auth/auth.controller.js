import { StatusCodes } from "http-status-codes";
import * as usersService from "../users/users.service.js";
import bcrypt from "bcryptjs";
import { UnauthenticatedError } from "../../errors/index.js";
import { dataUri } from "../../middlewares/multer.config.js"; // importer la configuration multer/datauri
import cloudinary from "../../config/cloudinary.config.js"; // importer la configuration Cloudinary
import mongoose from "mongoose";
import * as recipeService from "../recipes/recipes.service.js"; // Assurez-vous que le chemin est correct

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Vérifie si une image est fournie
  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Veuillez fournir une image de profil" });
  }

  // Vérifier la taille de l'image (max 5MB = 5 * 1024 * 1024 octets)
  const maxSize = 5 * 1024 * 1024; // 5 MB en octets
  if (req.file.size > maxSize) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "L'image dépasse la taille maximale autorisée de 5 MB",
    });
  }

  // Convertir l'image en DataURI
  const file = dataUri(req.file).content;

  try {
    // Uploader l'image sur Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(file, {
      folder: "user-profiles", // Dossier optionnel dans Cloudinary
    });

    // Créer un nouvel utilisateur avec l'URL de l'image
    const user = await usersService.create({
      name,
      email,
      password,
      imageUrl: cloudinaryResponse.secure_url, // URL de l'image uploadée
    });

    // Créer un token JWT
    const token = user.createAccessToken();
    res.status(StatusCodes.CREATED).json({ user, token });
  } catch (error) {
    throw new UnauthenticatedError("Erreur lors de l'inscription");
  }
};

const login = async (req, res) => {
  const user = await usersService.get({ email: req.body.email });

  if (!user) throw new UnauthenticatedError("Identifiants invalides");

  const isPasswordCorrect = await user.comparePasswords(req.body.password);

  if (!isPasswordCorrect)
    throw new UnauthenticatedError("Identifiants invalides");

  const token = user.createAccessToken();

  res.status(StatusCodes.OK).json({ user: { userId: user._id }, token });
};

const getUser = async (req, res) => {
  const { id } = req.params;

  const isMongoId = mongoose.isValidObjectId(id); // Vérifie si l'ID est valide

  if (!isMongoId) {
    throw new BadRequestError(`Format de l'id invalide : ${id}`);
  }

  const user = await usersService.getUser(id); // Récupère la tâche

  if (!user) {
    throw new NotFoundError(`Pas de tâche avec l'id : ${id}`);
  }

  res.status(StatusCodes.OK).json({ user }); // Renvoie la tâche
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const isMongoId = mongoose.isValidObjectId(id); // Vérifie si l'ID est valide
  if (!isMongoId) {
    throw new BadRequestError(`Format de l'id invalide : ${id}`);
  }

  const user = await usersService.getUser(id); // Récupère l'utilisateur
  if (!user) {
    throw new NotFoundError(`Aucun utilisateur trouvé avec l'id : ${id}`);
  }

  // Supprime toutes les recettes créées par cet utilisateur
  await recipeService.removeByUserId(id);

  // Supprime l'utilisateur
  await usersService.removeUser(id);
  res.status(StatusCodes.NO_CONTENT).send(); // Renvoie un statut 204 No Content
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, bio, password } = req.body;

  const isMongoId = mongoose.isValidObjectId(id);
  if (!isMongoId) {
    throw new BadRequestError(`Format de l'id invalide : ${id}`);
  }

  const user = await usersService.getUser(id);
  if (!user) {
    throw new NotFoundError(`Aucun utilisateur trouvé avec l'id : ${id}`);
  }

  // Vérifie si une nouvelle image est fournie
  let imageUrl = user.imageUrl; // Valeur par défaut : image actuelle de l'utilisateur
  if (req.file) {
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "L'image dépasse la taille maximale autorisée de 5 MB",
      });
    }
    const file = dataUri(req.file).content;
    const cloudinaryResponse = await cloudinary.uploader.upload(file, {
      folder: "user-profiles",
    });
    imageUrl = cloudinaryResponse.secure_url; // Met à jour l'image de profil
  }

  // Mettre à jour les informations de l'utilisateur
  const updatedData = {
    name: name || user.name,
    email: email || user.email,
    bio: bio || user.bio,
    password: password ? await bcrypt.hash(password, 10) : user.password,
    imageUrl,
  };

  const updatedUser = await usersService.updateUser(id, updatedData);

  res.status(StatusCodes.OK).json({ user: updatedUser });
};

export { login, register, getUser, deleteUser, updateUser };
