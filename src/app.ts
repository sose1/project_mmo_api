import express from 'express';
import * as bodyParser from 'body-parser';
import mongoose from "mongoose";

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers: any, port: number) {
        this.app = express();
        this.port = port;

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
        mongoose.connect('mongodb://localhost:27017/project_mmo', () => {
            console.log('connected to database')
        })
    }

public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;
