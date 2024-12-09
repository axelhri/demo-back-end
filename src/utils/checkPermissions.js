export const checkPermissions = (user, resourceOwnerId) => {
  if (user.role !== "admin" && user.userId !== resourceOwnerId.toString()) {
    throw new Error("Accès non autorisé");
  }
};
