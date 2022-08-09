const { Router } = require("express");

const FavoritesController = require("../controllers/FavoritesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const favoritesRoutes = Router();

const favoritesController = new FavoritesController();

favoritesRoutes.use(ensureAuthenticated);


favoritesRoutes.post("/:product_id", favoritesController.create);
favoritesRoutes.get("/", favoritesController.index);
// favoritesRoutes.post("/:id", favoritesController.create);
// favoritesRoutes.get("/:id", favoritesController.show);
// favoritesRoutes.delete("/", favoritesController.delete);

module.exports = favoritesRoutes;