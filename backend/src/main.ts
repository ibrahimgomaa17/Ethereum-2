import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

// async function bootstrap() {
//  const httpsOptions = {
//   key: fs.readFileSync('/etc/letsencrypt/live/blockchain.ibrahimgomaa.me/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/blockchain.ibrahimgomaa.me/fullchain.pem'),
// };

//   const app = await NestFactory.create(AppModule, { httpsOptions });

//   app.enableCors({
//       origin: [
//       'http://localhost:5173', // local frontend
//       'https://blockchain.ibrahimgomaa.me', // future deployed frontend
//     ],
//     credentials: true,
//   });

//   await app.listen(443, '0.0.0.0');
//   console.log('  HTTPS server running on https://blockchain.ibrahimgomaa.me');
// }
// bootstrap();


async function bootstrap() {
//  const httpsOptions = {
//   key: fs.readFileSync('/etc/letsencrypt/live/blockchain.ibrahimgomaa.me/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/blockchain.ibrahimgomaa.me/fullchain.pem'),
// };

  // const app = await NestFactory.create(AppModule, { httpsOptions });
  const app = await NestFactory.create(AppModule);

  app.enableCors({
      origin: [
      'http://localhost:5173', // local frontend
      'https://blockchain.ibrahimgomaa.me', // future deployed frontend
    ],
    credentials: true,
  });

  await app.listen(4000, '0.0.0.0');
  console.log('  HTTPS server running on localhost:4000');
}
bootstrap();
