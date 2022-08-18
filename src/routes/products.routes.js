const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const ProductsController = require("../controllers/ProductsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const productsRoutes = Router();
const upload = multer(uploadConfig.MULTER);
const productsController = new ProductsController();

productsRoutes.use(ensureAuthenticated);

productsRoutes.post("/", productsController.create);
productsRoutes.post("/update", productsController.update);
productsRoutes.patch("/", upload.single("avatar"), productsController.setPhoto);
productsRoutes.get("/", productsController.index);
productsRoutes.get("/id/:id", productsController.index);
productsRoutes.delete("/:id", productsController.delete);

module.exports = productsRoutes;