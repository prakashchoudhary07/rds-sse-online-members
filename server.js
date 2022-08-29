import express from 'express';
import cors from 'cors';
import { getUserId, getRDSUserSelfDetails } from './utils.js';
import {
  CORS_OPTIONS,
  UPDATE_SSE_EVENTS_TIME,
  SSE_RESPONSE_HEADER,
  LOCAL_PORT,
} from './constants.js';

const app = express();

app.use(express.json());

app.use(cors(CORS_OPTIONS));


app.get('/', async (req, res) => {
  try {
    res.status(200).send('Ok');
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: 'Internal server error',
      message: 'Some this went wrong please contact admin',
    });
  }
});

const users = {};

app.get('/online-members', async (req, res) => {
  try {
    const rdsCookie = req.headers.cookie;

    const response = await getRDSUserSelfDetails(rdsCookie);

    if (response.status !== 200) {
      return res.status(response.status).send({ ...response.data });
    }

    const userId = await getUserId(response);

    // data for sending
    let data;

    users[userId] = req;

    res.writeHead(200, SSE_RESPONSE_HEADER);

    const intervalId = setInterval(() => {
      console.log(`*** Interval loop. userId: "${userId}"`);

      data = {
        users: Object.keys(users),
      };

      if (!data) {
        res.write(`:\n\n`);
      } else {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
    }, UPDATE_SSE_EVENTS_TIME);

    // Note: Heatbeat for avoidance of client's request timeout of first time (30 sec)
    res.write(`:\n\n`);

    req.on('close', () => {
      console.log(`*** Close. userId: "${userId}"`);
      // Breaks the interval loop on client disconnected
      clearInterval(intervalId);
      // Remove from connections
      delete users[userId];
    });

    req.on('end', () => {
      console.log(`*** End. userId: "${userId}"`);
      delete users[userId];
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: 'Internal server error',
      message: 'Some this went wrong please contact admin',
    });
  }
});

app.get('/health-check', async (req, res) => {
  try {
    const rdsCookie = req.headers.cookie;

    const response = await getRDSUserSelfDetails(rdsCookie);

    res.status(response.status).send({ ...response.data });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: 'Internal server error',
      message: 'Some this went wrong please contact admin',
    });
  }
});

app.all('*', async(req,res)=>{
  res.status(404).send({staus: 404, message: 'Route not found'});
})

app.use((error, request, response, next) => {
  console.error( `error ${error.message}`) 
  const status = error.status || 400
  response.status(status).send(error.message)
})

const server_port = process.env.PORT | LOCAL_PORT;

app.listen(server_port, () => {
  console.log(`Example app listening on port ${server_port}`);
});
