// pustaka express
import { NextFunction, Response, Request, Router } from "express";

// tambahan otentikasi berbasis token (JSON Web Token & Passport)
import * as _ from "lodash";
import * as jwt from "jsonwebtoken";
import * as passportJWT from "passport-jwt";
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

// model basisdata
import { Masuk, MasukModel } from "../models/masuk";

/**
 * Variabel strategi JWT untuk Passport
 */
let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: 'sempusari'
}
export let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('payload diterima', jwt_payload);

  // Pemanggilan basisdata untuk mendapatkan semua akun pengguna
  // Nantinya akun pengguna akan didaftarkan ke sistem passport-jwt
  Masuk.find({}).then(users => { // Pemanggilan dari Model Masuk di MongoDB
    let user = users[_.findIndex(users, { id: jwt_payload.id })];
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
});

/**
 * @class MasukApi
 */
export class MasukApi {

  /**
   * Membuat API.
   * @static
   */
  public static masuk(router: Router) {
    // POST untuk Masuk
    router.post("/masuk", (req: Request, res: Response, next: NextFunction) => {
      new MasukApi().masuk(req, res, next);
    });
  }

  /**
   * Memeriksa akun pengguna untuk proses masuk.
   * @param req {Request} Objek permintaan express.
   * @param res {Response} Objek tanggapan express.
   * @param next {NextFunction} fungsi lanjutan kemudian.
   */
  public masuk(req: Request, res: Response, next: NextFunction) {

    Masuk.find(req.body.akun).then(masuk => {

      // cek pengguna apakah sesuai akun dan sandinya
      if (req.body.akun && req.body.sandi) {
        var akun = req.body.akun;
        var sandi = req.body.sandi;
      }

      // verifikasi akun tersedia
      var user = masuk[_.findIndex(masuk, { akun: akun })];
      if (!user === null) {
        res.sendStatus(401).json({ pesan: "tidak ditemukan pengguna" });
        next();
        return;
      }

      // cek 
      if (user.sandi === req.body.sandi) {
        var payload = { id: user.id };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ pesan: "sip", token: token });
      } else {
        res.status(401).json({pesan: "sandi tidak sesuai"});
      }

      next();
    }).catch(next);
  }

}
