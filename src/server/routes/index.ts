import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from './route';

/**
 * / route
 * 
 * @class User
 */

export class IndexRoute extends BaseRoute {

  /**
   * Create the routes.
   * 
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    // log
    console.log('[IndexRoute::Create] Creating index route.');
    // add home page route
    router.get('/', (req:Request, res:Response, next:NextFunction) => {
      new IndexRoute().index(req, res, next);
    });
  }

  /**
   * Constructor
   * 
   * @class IndexRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The home page route.
   * 
   * @class IndexRoute
   * @method index
   * @param req {Request} The express request object.
   * @param res {Response} The express response object.
   * @next {NextFunction} Execute the next method.
   */
  public index(req: Request, res: Response, next: NextFunction) {
    // set custom title
    this.title = "Home | Tour of Heroes";
    // set options
    let options: Object = {
      "message": "Welcome to the Tour of Heroes"
    };
    // render template
    this.render(req, res, "index", options);
  }
}