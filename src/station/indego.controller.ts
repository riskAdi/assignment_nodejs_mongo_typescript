import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';

import * as cron from 'node-cron';
import fetch from 'node-fetch';
import * as moment from 'moment';
import * as cluster from 'cluster';

import stationModel from './station.model';
import jobModel from './job.model';


class IndegoController implements Controller {

  public path = '/indego-data-fetch-and-store-it-db';
  public router = Router();
  private station = stationModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    if (cluster.isMaster) {
      cron.schedule('0 * * * *', () => {
        console.log('-----Running cron every hour---');
        this.cronForStationsToSaveData();
      });
    }
  }

  private saveStationsLocally = async (stationsJson : any, latestId: number, date : string) => {

    const dumpArray: any[] = [];

    stationsJson.features.forEach((data: any) => {
      const { id, name } = data.properties;
      dumpArray.push({ id, name, data, date });
      // if (latestId > 0) {
      //   if (id > latestId) {
      //     dumpArray.push({ id, name, data, date });
      //   }
      // }else {
      //   dumpArray.push({ id, name, data, date });
      // }
    });

    await this.station.insertMany(dumpArray);
  }

  private cronForStationsToSaveData = async () => {

    const date  = moment().format('YYYY-MM-DDTHH:mm:ssZ');

    try {

      const stations:any = await fetch('https://kiosks.bicycletransit.workers.dev/phl');
      const stationsJson = await stations.json();

      const checkIfEmpty = await this.station.findOne({}, null, { sort: { id: -1 } });
      this.saveStationsLocally(stationsJson, (!checkIfEmpty) ? 0 : checkIfEmpty.id, date);

      await jobModel.create({ jobDateTime: date, status: 'completed' });

    } catch (e) {
      await jobModel.create({ jobDateTime: date, status: 'failed' });
    }

  }

}

export default IndegoController;
