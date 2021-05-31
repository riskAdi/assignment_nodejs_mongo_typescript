import { Request, Response, NextFunction, Router } from 'express';
import InvalidRequest from '../exceptions/InvalidRequest';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
import stationModel from './station.model';
import jobModel from './job.model';
import fetch from 'node-fetch';

class StationController implements Controller {
  public path = '/stations';
  public router = Router();
  private station = stationModel;
  private job = jobModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(`${this.path}`, authMiddleware , this.getStationAtSpecifiedTime);
    this.router.get(`${this.path}/:id`, authMiddleware , this.getStationAtSpecifiedTimeWithId);
  }

  private getStationAtSpecifiedTime = async (request: Request, response: Response, next: NextFunction) => {

    const { at } = request.query;
    if (!at) {
      next(new InvalidRequest());
      return;
    }

    try {

      const getDate = await this.job.find({ jobDateTime: { $gte : new Date(at) }, status: 'completed' }).limit(1);
      if (getDate.length < 1) {
        response.status(404).send('no suitable data is available.');
        return;
      }

      const { jobDateTime } = getDate[0];
      const resp = await this.station.find({ date : jobDateTime }).sort({ date: 1 }).limit(1);
      const weatherJson = await this.getWeatherData();
      response.status(200).send({
        at,
        stations : resp,
        weather : weatherJson,

      });
    } catch (e) {
      response.status(404).send(e.message);
    }

  }

  private getStationAtSpecifiedTimeWithId = async (request: Request, response: Response, next: NextFunction) => {

    const { at } = request.query;
    const { id } = request.params;
    if (!at || !id) {
      next(new InvalidRequest());
      return;
    }

    try {

      const getDate = await this.job.find({ jobDateTime: { $gte : new Date(at) }, status: 'completed' }).limit(1);
      if (getDate.length < 1) {
        response.status(404).send('no suitable data is available');
        return;
      }

      const { jobDateTime } = getDate[0];
      const resp = await this.station.find({ date : jobDateTime, id : parseInt(id) }).sort({ date: 1 }).limit(1);
      if (resp.length < 1) {
        response.status(404).send('no suitable data is available');
        return;
      }

      const weatherJson = await this.getWeatherData();
      response.status(200).send({
        at,
        stations : resp,
        weather : weatherJson,

      });
    } catch (e) {
      response.status(404).send(e.message);
    }
  }

  private getWeatherData = async () => {

    const { WEATHER_API } = process.env;
    const weatherResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Philadelphia&appid=${WEATHER_API}`);
    const weatherJson = await weatherResp.json();
    return weatherJson;
  }

}

export default StationController;
