const knex = require("../database/knex");

class FavoritesController {

    async create(req, res) {
        const { product_id } = req.params;
        const user_id = req.user.id;

        const alreadyFavorited = await knex("favorites").where({ product_id, user_id });

        if (alreadyFavorited.length === 1) {
            await knex("favorites").where({ product_id, user_id }).delete();
            return res.json(product_id);
        }

        await knex("favorites").insert({ product_id, user_id });

        return res.json(product_id);
    }

    async index(req, res) {
        const user_id = req.user.id;
        const favorites = await knex("favorites").where({ user_id });

        return res.json(favorites);
    }

}

module.exports = FavoritesController;