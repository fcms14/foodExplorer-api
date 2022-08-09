exports.up = knex => knex.schema.createTable("orders", table => {
    table.increments("id").primary();    
    table.integer("user_id").references("id").inTable("users");
    
    table.text("paymentMethod");
    table.text("status");
    table.float("total");
    table.float("paid");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());

  });
  
  exports.down = knex => knex.schema.dropTable("orders");
  