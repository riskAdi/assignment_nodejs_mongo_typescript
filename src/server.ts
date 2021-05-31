import 'dotenv/config';
import App from './app';
import StationController from './station/station.controller';
import IndegoController from './station/indego.controller';
import validateEnv from './utils/validateEnv';
validateEnv();

const app = new App(
  [
    new StationController(),
    new IndegoController(),
  ],
);

app.listen();
