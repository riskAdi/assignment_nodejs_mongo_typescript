import * as mongoose from 'mongoose';
import Job from './job.interface';

const jobSchema = new mongoose.Schema({
  jobDateTime: Date,
  status: String,
});

const jobModel = mongoose.model<Job & mongoose.Document>('Job', jobSchema);

export default jobModel;
