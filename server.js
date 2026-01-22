import http from "http";
import app from "./app";
import { initNobarSocket } from "./socket/nobar";

const server = http.createServer(app);
initNobarSocket(server);

server.listen(3000);
