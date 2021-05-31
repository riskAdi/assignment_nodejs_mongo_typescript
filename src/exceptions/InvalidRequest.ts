import HttpException from './HttpException';

class InvalidRequest extends HttpException {
  constructor() {
    super(404, 'Invalid Request');
  }
}

export default InvalidRequest;
