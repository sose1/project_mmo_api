import App from './app';
import CharacterController from "./character/CharacterController";
import AccountController from "./account/AccountController";

const app = new App(
    [
        new CharacterController(),
        new AccountController()
    ]
);

app.connectToMongo();
app.listen();
