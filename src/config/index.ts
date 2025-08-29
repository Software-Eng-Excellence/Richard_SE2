import dotenv from "dotenv";
import path from "path"

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});
export default{
  logDir: process.env.LOG_DIR || "./logs",
  isDev: process.env.NODE_ENV === "development",
  Storage:{
    csv:{
      cake: "src/data/cake_orders.csv"
    },
    sqlite: "src/data/order.db"
  }


}