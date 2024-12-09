import { z } from "zod";
import mongoose from "mongoose";
import { INGREDIENTS_UNITS, CATEGORIES } from "../../utils/constants.js";

const RecipeParamsSchema = z.object({
  id: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: "Format de l'ID invalide",
  }),
});

const IngredientSchema = z.object({
  name: z.string().trim().min(1, "Veuillez fournir le nom de l'ingrédient"),
  quantity: z.number().positive("Veuillez fournir une quantité valide"),
  unit: z.enum(
    [
      INGREDIENTS_UNITS.GRAMMES,
      INGREDIENTS_UNITS.LITRES,
      INGREDIENTS_UNITS.TBSP,
      INGREDIENTS_UNITS.KG,
      INGREDIENTS_UNITS.MG,
      INGREDIENTS_UNITS.ML,
      INGREDIENTS_UNITS.CL,
      INGREDIENTS_UNITS.SPOON,
      INGREDIENTS_UNITS.CUP,
      INGREDIENTS_UNITS.PINCH,
      INGREDIENTS_UNITS.PIECE,
    ],
    {
      errorMap: () => ({
        message: "Unité invalide, veuillez choisir parmi les unités autorisées",
      }),
    }
  ),
});

const RecipeBodySchema = z.object({
  title: z.string().trim().min(1, "Veuillez fournir un titre"),
  description: z.string().trim().min(1, "Veuillez fournir une description"),
  ingredients: z
    .array(IngredientSchema)
    .min(1, "Veuillez fournir au moins un ingrédient"),
  imageUrl: z.string().url({ message: "URL d'image invalide" }), // Champ optionnel pour l'URL de l'image
  eaters: z.number().positive("Veuillez fournir le nombre de personne"),
  categories: z.enum([
    CATEGORIES.appetizers,
    CATEGORIES.meal,
    CATEGORIES.dessert,
    CATEGORIES.drink,
    CATEGORIES.lunch,
  ]),
});

export { RecipeBodySchema, RecipeParamsSchema };
