import { create, router as _router, defaults } from 'json-server';

const server = create();
const router = _router('./db.json');
const middlewares = defaults();

server.use(middlewares);
server.use(router);

export default server;
