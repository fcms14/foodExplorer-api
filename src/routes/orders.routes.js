const { Router } = require("express");

const OrdersController = require("../controllers/OrdersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const ordersRoutes = Router();
const ordersController = new OrdersController();

ordersRoutes.use(ensureAuthenticated);

ordersRoutes.get("/", ordersController.index);
ordersRoutes.get("/cart/", ordersController.show);
ordersRoutes.post("/", ordersController.create);
ordersRoutes.put("/", ordersController.update);

module.exports = ordersRoutes;