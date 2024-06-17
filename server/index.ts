import type { Express, Request, Response } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import Modbus from 'modbus-serial';
import { Server } from 'socket.io';
import { createServer } from 'http';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const modbusClient = new Modbus();
const modbusClient2 = new Modbus();

modbusClient.connectTCP('127.0.0.1', { port: 502 });
modbusClient2.connectTCP('127.0.0.1', { port: 502 });

io.on('connection', (socket) => {
  console.log('We are live and connected');
  console.log(socket.id);
  setInterval(() => {
    modbusClient.readHoldingRegisters(0, 2).then(({ data }) => {
      modbusClient.setID(1);

      console.log({ arrayData: data, id: modbusClient.getID() });
      socket.emit('message', { arrayData: data, id: modbusClient2.getID() });
    });
  }, 1000);
  setInterval(() => {
    modbusClient2.readHoldingRegisters(0, 2).then(({ data }) => {
      modbusClient2.setID(2);

      console.log({ arrayData: data, id: modbusClient2.getID() });
      socket.emit('message2', { arrayData: data, id: modbusClient2.getID() });
    });
  }, 1000);
});

httpServer.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
