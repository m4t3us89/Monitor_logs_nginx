import * as dotenv from 'dotenv' 
dotenv.config()

import express from 'express'
const app = express()

import http from 'node:http'
const server = http.createServer(app);

import { Server } from 'socket.io'
const io = new Server(server);

import { URL } from 'url'; 
const __filename = new URL('../public/', import.meta.url).pathname;

const dir = process.env.DIR_FILE

import { spawn } from 'node:child_process'

app.get('/', (req, res) => {
    res.sendFile(__filename + 'index.html');
});

io.on('connection', (socket) => {
    const tail = spawn('tail', ['-f', dir]);
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
        tail.kill('SIGHUP');
    });


    tail.stdout.on('data', function (data) {
        socket.emit("message",  data.toString());   
    });

    tail.on('close', (code, signal) => {
        console.log(
          `child process terminated due to receipt of signal ${signal}`);
    });
});


server.listen(8081, () => {
    console.log('listening on *:8081');
});


