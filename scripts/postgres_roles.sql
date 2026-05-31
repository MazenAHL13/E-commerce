DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ecommerce_admin') THEN
    CREATE ROLE ecommerce_admin LOGIN PASSWORD 'ecommerce_admin';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ecommerce_app') THEN
    CREATE ROLE ecommerce_app LOGIN PASSWORD 'ecommerce_app';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ecommerce_readonly') THEN
    CREATE ROLE ecommerce_readonly LOGIN PASSWORD 'ecommerce_readonly';
  END IF;
END $$;

GRANT CONNECT ON DATABASE ecommerce TO ecommerce_admin, ecommerce_app, ecommerce_readonly;
GRANT USAGE ON SCHEMA public TO ecommerce_admin, ecommerce_app, ecommerce_readonly;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ecommerce_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ecommerce_admin;

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO ecommerce_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ecommerce_app;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO ecommerce_readonly;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON TABLES TO ecommerce_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE ON TABLES TO ecommerce_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO ecommerce_readonly;
