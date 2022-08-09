const knex = require("../database/knex");
// const sqliteConnection = require("../database/sqlite")
const DiskStorage = require("../providers/DiskStorage");

class OrdersController {
    async create(req, res) {
        const { cart, paymentMethod, total, paid } = req.body;
        const user_id = req.user.id;

        const order_id = await knex("orders").insert({
            user_id,
            paymentMethod,
            status: "Pendente",
            total,
            paid
        });

        const itens = cart.map(c => {
            return {
                order_id,
                product_id: c.product_id,
                name: c.product_name,
                price: c.product_price,
                groupProduct: c.product_group,
                quantity: c.quantity
            }
        });

        await knex("ordersItems").insert(itens);

        return res.json(order_id);
    }

    async show(req, res){
        const { id } = req.query;
        console.log(id);

        const order = await knex("orders").where({id}).first();
        console.log(order);

        return res.json(order);
    }

    async index(req, res) {
        // const { name, ingredients = false } = req.query;

        const orders = await knex("orders")
                .whereNot("status", "Entregue")
                .orderBy("updated_at")

        const ordersItems = await knex("ordersItems");
        const items = orders.map(order => {
            const item = ordersItems.filter(orderItem => orderItem.order_id === order.id);

            return {
                ...order,
                orderItem: item
            }
        });

        return res.json(items);
    }

    async update(req, res) {
        const { orderId, status } = req.body;
        // const order = await knex("orders").where('id', '=', orderId).update({status: status});

        knex("orders")
          .update({status})
          .where({id: orderId})
          .then(u => res.status(!!u?200:404).json({success:!!u}))
          .catch(e => res.status(500).json(e));

        return res;
    }

    // async show(req, res){
    //     const { id } = req.params;

    //     const order = await knex("orders").where({id : Number(id)}).first();
    //     console.log("teste", parseInt((id));

    //     return res.json(order);
    // }

    // async delete(req, res){
    //     const {id} = req.params;

    //     await knex.raw('PRAGMA foreign_keys = ON');
    //     await knex("products").where({id}).delete();

    //     return res.json();
    // }


    // async index(req, res) {
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
    //             // .innerJoin("favorites", "products.id", "favorites.products_id")
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

module.exports = OrdersController;