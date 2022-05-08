import App from './app';
import PlayerController from "./player/application/PlayerController";

const app = new App(
    [
        new PlayerController()
    ]
);

app.connectToMongo();
app.listen();
