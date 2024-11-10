import * as pg from "pg";
const {Pool} = pg.defaults;

const connectionPool = new Pool({
  connectionString: "postgresql://postgres:c7F357e7@localhost:4000/profiles",
});

export default connectionPool;