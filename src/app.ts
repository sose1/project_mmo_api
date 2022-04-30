import express from 'express';
import * as bodyParser from 'body-parser';
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

class App {
    public app: express.Application;
    private port = process.env.PORT;
    private mongodbUrl = process.env.MONGO_DB_URL

    constructor(controllers: any) {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeLoggerMiddleware();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
    }

    private initializeLoggerMiddleware() {
        this.app.use(this.loggerMiddleware)
    }

    private loggerMiddleware(request: express.Request,
                             response: express.Response,
                             next: any) {
        console.log(`${request.method} ${request.path}`);
        next();
    }

    private initializeControllers(controllers: any) {
        controllers.forEach((controller: any) => {
            this.app.use('/api/v1', controller.router);
        });
    }

    public connectToMongo() {
        mongoose.connect(`${this.mongodbUrl}`, () => {
            console.log(`connected to database url: ${this.mongodbUrl}`)
        })
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;
