import path from "path";

type SendToIndexMiddleware = (req: any, res: any) => any;

const sendToIndexMiddleware: SendToIndexMiddleware = (req, res) => res.sendFile(path.resolve('.assets', 'index.html'));

export default sendToIndexMiddleware;
