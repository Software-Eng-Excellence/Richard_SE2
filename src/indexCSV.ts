import express, { Request, Response, NextFunction } from "express";
import config from "./config";
import logger from "./util/logger";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import requestLogger from "./middleware/requestLogger";
import routes from "./routes";
import { HttpException } from "./util/exceptions/http/HttpException";



const app = express();

//config helmet
app.use(helmet());

//config body parser
app.use(bodyParser.json());
//localhost:300/orders?limit=10... encoding is using urlencode
app.use(bodyParser.urlencoded({ extended: true }));
// in cors which person can access which resource
//config cors
app.use(cors());

// add middleware
app.use(requestLogger);


//config routes
app.use("/",routes);

//config 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
 
  res.status(404).json({ error: 'Not Found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
if(err instanceof HttpException) {
  const httpException = err as HttpException;
  logger.error("%s [%d] \"%s\" %o", httpException.name, httpException.status, httpException.message, httpException.details || {});
  res.status(httpException.status).json({ message: httpException.message, details: httpException.details || undefined});

}
else{
  logger.error("Unhandled Error: %s", err.message);
  res.status(500).json({ error: 'Internal Server Error' });
}
});


app.listen(config.port, config.host, () => {
  logger.info(`Server is running on http://%s:%d`, config.host, config.port);
});



