import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';
//import * as express from 'express';  //use this when working in development

const expressApp = express();

let app: any;

async function bootstrap() {
  if (!app) {
    try {
      
      app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        { logger: ['error', 'warn'] }  
      );

    
      app.enableCors();

      await app.init();
    } catch (error) {
      console.error('Bootstrap error:', error);
      throw error;
    }
  }
  return app;
}


export default async function handler(req: any, res: any) {
  try {
    const app = await bootstrap();
    const expressInstance = app.getHttpAdapter().getInstance();
    return expressInstance(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Local development server
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((app) => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Application is running on: http://localhost:${port}`);
    });
  }).catch((error) => {
    console.error('Local server error:', error);
    process.exit(1);
  });
}