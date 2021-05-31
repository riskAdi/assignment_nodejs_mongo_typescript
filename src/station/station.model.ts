import * as mongoose from 'mongoose';
import Station from './station.interface';

const stationSchema = new mongoose.Schema({
  id: Number,
  name: String,
  data: Object,
  date: Date,
});

const stationModel = mongoose.model<Station & mongoose.Document>('Station', stationSchema);

export default stationModel;
