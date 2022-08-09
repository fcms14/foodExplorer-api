exports.up = knex => knex.schema.createTable("ordersItems", table => {
    table.increments("id").primary();

    table.integer("order_id").references("id").inTable("orders");
    table.integer("product_id").references("id").inTable("products");
    table.text("name");
    table.float("price");
    table.float("quantity");
    table.text("groupProduct");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });
  
  exports.down = knex => knex.schema.dropTable("ordersItems");
  