import { Response } from 'express';

type FetchHealthEndpoint = (req: any, res: Response) => Promise<void>;

const fetchHealthEndpoint: FetchHealthEndpoint = async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.send({});
};

export default fetchHealthEndpoint;
