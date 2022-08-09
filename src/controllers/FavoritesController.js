const knex = require("../database/knex");

class FavoritesController {
    async create(req, res) {
        const { product_id } = req.params;
        const user_id = req.user.id;

        const alreadyFavorited = await knex("favorites").where({ product_id, user_id });

        if (alreadyFavorited.length === 1 ) {
            await knex("favorites").where({ product_id, user_id }).delete();
            return res.json(product_id);
        }
        await knex("favorites").insert({ product_id, user_id });
        return res.json(product_id);
    }

    async index(req, res) {
        const user_id = req.user.id;
        const favorites = await knex("favorites").where({user_id});
        return res.json(favorites);
    }


    // async delete(req, res) {
    //     const { id } = req.params;

    //     await knex("products").where({ id }).delete();

    //     // const database = await sqliteConnection();
    //     // await database.get("delete from movie_notes where id = (?)", [id]);

    //     return res.json();
    // }


    // async select(req, res) {
    //     const { name, ingredients = false } = req.query;
    //     // console.log(name, ingredients)

    //     let products;

    //     if (ingredients) {
    //         const filterTags = ingredients.split(',').map(movie_tag => movie_tag.trim());

    //         products = await knex("ingredients")
    //             .select([
    //                 "products.id",
    //                 "products.name",
    //                 "products.description",
    //                 "products.user_id",
    //             ])
    //             .where("products.user_id", user_id)
    //             .whereLike("products.name", `%${name}%`)
    //             .whereIn("tag_name", filterTags)
    //             .innerJoin("products", "products.id", "ingredients.products_id")
    //             .groupBy("products.id")
    //             .orderBy("name");
    //     }
    //     else {
    //         products = await knex("products")
    //             // .where({user_id})
    //             .whereLike("name", `%${name}%`)
    //             .orderBy("groupProduct")
    //             .orderBy("name");
    //     }

    //     const ingresdientsList = await knex("ingredients");
    //     const productWithTags = products.map(product => {
    //         const ingredientsTags = ingresdientsList.filter(tag => tag.product_id === product.id);

    //         return {
    //             ...product,
    //             ingredients: ingredientsTags
    //         }
    //     });

    //     return res.json(productWithTags);
    // }

}

module.exports = FavoritesController;