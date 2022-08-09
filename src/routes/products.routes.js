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


// productsRoutes.get("/:id", movieNotesController.show);
// productsRoutes.get("/", movieNotesController.index);
// productsRoutes.post("/", productsController.create, upload.single("avatar"), (req, resp) => {
//     console.log(req.file.filename);
//     console.log(req.file);
//     console.log(req.body);
//     resp.json();
// });
// productsRoutes.patch("/", upload.single("avatar"), productsController.update);

module.exports = productsRoutes;