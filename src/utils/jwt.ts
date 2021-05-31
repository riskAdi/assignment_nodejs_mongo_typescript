
import * as jwt from 'jsonwebtoken';

function generateAccessToken(username: string) {

    const decoded = jwt.verify(process.env.TOKEN_SECRET, 'shhhhh');
   

    return jwt.sign({ foo: 'bar' }, 'shhhhh');
}

export default generateAccessToken;
