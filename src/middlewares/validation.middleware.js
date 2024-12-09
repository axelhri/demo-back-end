import { z } from "zod";
import { StatusCodes } from "http-status-codes";

const validate =
  ({ bodySchema, paramsSchema }) =>
  (req, res, next) => {
    try {
      // if (bodySchema) {
      //   const parsedBody = bodySchema.parse(req.body);
      //   req.body = parsedBody;
      // }

      // if (paramsSchema) {
      //   const parsedParams = paramsSchema.parse(req.params);
      //   req.params = parsedParams;
      // }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: error.errors });
      }

      next(error);
    }
  };

export default validate;
