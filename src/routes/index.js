const { Router } = require("express");

const usersRoutes = require("./users.routes")
const sessionsRoutes = require("./sessions.routes")
const productsRoutes = require("./products.routes")
const favoritesRoutes = require("./favorites.routes")
const ordersRoutes = require("./orders.routes")

// const notesRoutes = require("./notes.routes")
// const tagsRoutes = require("./tags.routes")

const routes = Router();
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/products", productsRoutes);
routes.use("/favorites", favoritesRoutes);
routes.use("/orders", ordersRoutes);
// routes.use("/notes", notesRoutes);
// routes.use("/tags", tagsRoutes);

module.exports = routes;