import { Response } from 'express';

type FetchSetupEndpoint = (env) => (req: any, res: Response) => Promise<void>;

const fetchSetupEndpoint: FetchSetupEndpoint = (env) => async (req, res) => {
  const appui = JSON.stringify({});
  // WARNING! Try everything we can to make sure the assets are NOT cached
  // This is the worst file to have cached, ensure this file does not cache
  res.set('Content-Type', 'application/javascript');
  res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.set('Expires', '-1');
  res.set('Pragma', 'no-cache');
  res.status(200);
  res.send(`window.appui = ${appui}`);
};

export default fetchSetupEndpoint;
