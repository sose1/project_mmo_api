import App from './app';
import UserController from "./user/application/UserController";

const app = new App(
    [
        new UserController()
    ]
);

app.connectToMongo();
app.listen();
