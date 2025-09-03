import dotenv from "dotenv";
import path from "path"
import { DBMode } from "../repository/Repository.factory";

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});
export default{
  logDir: process.env.LOG_DIR || "./logs",
  isDev: process.env.NODE_ENV === "development",
  port:process.env.PORT ?  parseInt(process.env.PORT ) : 3000,
  host: process.env.HOST || "localhost",
  dbMode:DBMode.SQLITE,
  Storage:{
    csv:{
      cake: "src/data/cake_orders.csv"
    },
    sqlite: "src/data/order.db",
    postgres:{
      user: "neondb_owner",
      password: "npg_67hQpqzDkSZe",
      host: "ep-nameless-surf-a2av6285-pooler.eu-central-1.aws.neon.tech",
      database: "neondb",
      ssl: {
        rejectUnauthorized: false
      }
    }
  }


}