import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as morgan from 'morgan';
import * as path from 'path';
import * as passport from 'passport';
import errorHandler = require('errorhandler');
import mongoose = require('mongoose');

// api
import { MasukApi, strategy } from './apis/masuk';

// penggunaan strategi dari ./apis/masuk
passport.use(strategy);

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  /**
   * The express application.
   * @type {Application}
   */
  public app: express.Application;

  /**
   * Bootstrap the application.
   * @static
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add api
    this.api();
  }

  /**
   * REST API endpoints.
   */
  public api() {
    var router = express.Router();

    // configure CORS
    const corsOptions: cors.CorsOptions = {
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
      credentials: true,
      methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
      origin: 'http://localhost:3000',
      preflightContinue: false
    };
    router.use(cors(corsOptions));

    // root request
    router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.json({ pesan: 'Selamat Datang di Purwarupa API.' });
      next();
    });

    // create API routes
    MasukApi.masuk(router);

    // wire up the REST API
    this.app.use('/api', router);

    // enable CORS pre-flight
    router.options('*', cors(corsOptions));
  }

  /**
   * Configure application
   *
   * @class Server
   */
  public config() {
    // morgan middleware to log HTTP requests
    this.app.use(morgan('dev'));

    //use query string parser middlware
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    //use json form parser middlware
    this.app.use(bodyParser.json());

    // connect to mongoose
    mongoose.Promise = global.Promise;
    let mongodbUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/purwarupa';
    var options = {
      useMongoClient: true,
      socketTimeoutMS: 0,
      keepAlive: true,
      reconnectTries: 30
    }
    mongoose.connect(mongodbUri, options);
    mongoose.connection.on('error', error => {
      console.error(error);
    });

    this.app.use(express.static(path.resolve('dist/public')));
    var router = express.Router();
    router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.sendFile(path.resolve('dist/public') + '/index.html');
      next();
    });
    this.app.use('/', router);

    //catch 404 and forward to error handler
    this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      err.status = 404;
      next(err);
    });

    // Inisialisasi Passport
    this.app.use(passport.initialize());

    //error handling
    this.app.use(errorHandler());
  }
}