import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import errorHandler = require('errorhandler');
import methodOverride = require('method-override');

// Route Import
import { IndexRoute } from "./routes/index";

/**
 * The Server
 * @class Server
 */
export class Server {

  public app: express.Application;
  /**
   * Bootstrap Application
   * 
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Return the newly created injector for this
   */

  public static bootstrap(): Server{
    return new Server();
  }

  /**
   * Constructor.
   * 
   * @class Server
   * @constructor
   */

   constructor() {
     // create expressjs application
     this.app = express();
     // configure application
     this.config();
     // add routes
     this.routes();
     // add api
     this.api();
   }

   /**
    * Create REST API routes
    * 
    * @class Server
    * @method api
    */
  public api() {
    // empty for now
  }

  /**
   * Configure application
   * 
   * @class Server
   * @method config
   */
  public config() {
    // add static paths
    this.app.use(express.static(path.resolve('public')));
    // configure pug
    this.app.set('views', path.resolve('views'));
    this.app.set('view engine', 'pug');
    // use logger middleware
    this.app.use(logger('dev'));
    // use json from parser middleware
    this.app.use(bodyParser.json());
    // use query string parser middleware
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
    // use cookie parser middleware
    this.app.use(cookieParser('Secret_Goes_Here'));
    // use override middleware
    this.app.use(methodOverride());
    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction){
      err.status = 404;
      next(err);
    });
    //error handling
    this.app.use(errorHandler());
  }

    /**
     * Create Router
     * 
     * @class Server
     * @method routes
     * @return void
     */
    private routes() {
      let router: express.Router;
      router = express.Router();
      // Index Route
      IndexRoute.create(router);
      // use router middleware
      this.app.use(router);
    }
}