const knex = require("../database/knex");

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

        return res.json(await knex("orders").where({id}).first());
    }

    async index(req, res) {
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

        knex("orders")
          .update({status})
          .where({id: orderId})
          .then(u => res.status(!!u?200:404).json({success:!!u}))
          .catch(e => res.status(500).json(e));

        return res;
    }
    
}

module.exports = OrdersController;