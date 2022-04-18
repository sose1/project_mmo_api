import App from './app';
import UserController from "./user/application/UserController";

const app = new App(
    [
        new UserController()
    ],
    8080,
);

app.connectToMongo();
app.listen();
