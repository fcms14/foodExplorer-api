const knex = require("../database/knex");
// const sqliteConnection = require("../database/sqlite")
const DiskStorage = require("../providers/DiskStorage");

class ProductsController {
    async create(req, res) {
        const { name, description, price, groupProduct, tags } = req.body;
        const user_id = req.user.id;

        const product_id = await knex("products").insert({
            name,
            description,
            price,
            groupProduct,
            user_id
        });

        const tagsInsert = tags.map(name => {
            return {
                product_id,
                name,
                user_id
            }
        });

        await knex("ingredients").insert(tagsInsert);

        return res.json(product_id);
    }

    async update(req, res) {
        const { name, description, price, groupProduct, tags, id } = req.body;
        const user_id = req.user.id;
        const product = {};
       
        if (name != "") { product.name = name}
        if (description != "") { product.description = description}
        if (price != "") { product.price = price}
        if (groupProduct != "") { product.groupProduct = groupProduct}

        if (Object.keys(product).length > 0) {
            await knex("products").update(product).where({ id });
        }

        if (Object.keys(tags).length > 0 ) {
            const tagsInsert = tags.map(name => {
                return {
                    product_id: id,
                    name,
                    user_id
                }
            });
                
            if (Object.keys(tagsInsert).length > 0) {
                await knex("ingredients").where('product_id', id).delete();
                await knex("ingredients").insert(tagsInsert);
            }
        }

        return res.json(1);
    }


    async setPhoto(req, res) {
        const { product_id } = req.body;
        const avatarFilename = req.file.filename;
        const user_id = req.user.id;

        const diskStorage = new DiskStorage();

        const user = await knex("users")
            .where({ id: user_id }).first();

        if (!user) {
            throw new AppError("Somente usuários autenticadas podem mudar a foto do produto", 401);
        }

        const product = await knex("products")
            .where({ id: product_id }).first();

        if (product.picture) {
            await diskStorage.deleteFile(product.picture);
        }

        const filename = await diskStorage.saveFile(avatarFilename);
        product.picture = filename;

        await knex("products").update(product).where({ id: product_id });

        return res.json(user)
    }

    // async show(req, res){
    //     const {id} = req.params;

    //     const movie_notes = await knex("movie_notes").where({id}).first();
    //     const movie_tags = await knex("movie_tags").where({movie_notes_id : id}).orderBy("tag_name");

    //     return res.json({
    //         ...movie_notes,
    //         movie_tags
    //     });
    // }

    async delete(req, res){
        const {id} = req.params;

        // await knex.raw('PRAGMA foreign_keys = ON');
        await knex("products").where({id}).delete();

        return res.json();
    }

    async index(req, res) {
        const { name = "", ingredients = false } = req.query;
        const { id = "" } = req.params;

        let products;

        if (ingredients) {
            const filterTags = ingredients.split(',').map(movie_tag => movie_tag.trim());

            products = await knex("ingredients")
                .select([
                    "products.id",
                    "products.name",
                    "products.description",
                    "products.user_id",
                ])
                .where("products.user_id", user_id)
                .whereLike("products.name", `%${name}%`)
                .whereIn("tag_name", filterTags)
                .innerJoin("products", "products.id", "ingredients.products_id")
                .groupBy("products.id")
                .orderBy("name");
        }
        else if (id != "") {
            products = await knex("products")
                .where({id});

            const ingresdientsList = await knex("ingredients");
            const productWithTags = products.map(product => {
                const ingredientsTags = ingresdientsList.filter(tag => tag.product_id === product.id);
    
                return {
                    ...product,
                    ingredients: ingredientsTags
                }
            });
            return res.json(productWithTags[0]);
        }
        else {
            products = await knex("products")
                .whereLike("name", `%${name}%`)
                // .where({id})
                .orderBy("groupProduct")
                .orderBy("name");

            const ingresdientsList = await knex("ingredients");
            const productWithTags = products.map(product => {
                const ingredientsTags = ingresdientsList.filter(tag => tag.product_id === product.id);
    
                return {
                    ...product,
                    ingredients: ingredientsTags
                }
            });
            return res.json(productWithTags);
        }


    }

}

module.exports = ProductsController;