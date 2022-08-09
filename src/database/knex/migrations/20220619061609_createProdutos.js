exports.up = knex => knex.schema.createTable("products", table => {
    table.increments("id").primary();
    table.text("name");
    table.text("description");
    table.float("price");
    table.text("picture");
    table.text("groupProduct");

    table.integer("user_id").references("id").inTable("users");  
    
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });
  
  exports.down = knex => knex.schema.dropTable("products");
  