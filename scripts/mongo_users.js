db = db.getSiblingDB("ecommerce");

db.createUser({
  user: "ecommerce_mongo_app",
  pwd: "ecommerce_mongo_app",
  roles: [
    {
      role: "readWrite",
      db: "ecommerce"
    }
  ]
});

db.createUser({
  user: "ecommerce_mongo_readonly",
  pwd: "ecommerce_mongo_readonly",
  roles: [
    {
      role: "read",
      db: "ecommerce"
    }
  ]
});

print("Usuarios Mongo creados: ecommerce_mongo_app, ecommerce_mongo_readonly");
