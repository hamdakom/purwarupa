process.env.NODE_ENV = "test";

// mocha
import "mocha";
import { suite, test } from "mocha-typescript";

// mongodb
import { ObjectID } from "mongodb";

// server
import { Server } from "../server";

// model
import { Masuk } from "../interfaces/masuk";
import { MasukModel, MasukModelStatic } from "../models/masuk";
import { masukSchema } from "../schemas/masuk";

// mongoose
import mongoose = require("mongoose");

//require http server
var http = require("http");

//require chai and use should assertions
let chai: Chai.ChaiStatic = require("chai");
chai.should();

//configure chai-http
chai.use(require("chai-http"));

@suite class MasukTest {

  // constants
  public static BASE_URI: string = "/api/masuk";

  // the mongooose connection
  public static connection: mongoose.Connection;

  // masuk model
  public static Masuk: MasukModelStatic;

  // masuk document
  public static masuk: MasukModel;

  // the http server
  public static server: any;

  /**
   * Before all hook.
   */
  public static before() {
     // connect to MongoDB
    mongoose.connect("mongodb://localhost:27017/purwarupa");
    MasukTest.Masuk = mongoose.model<MasukModel, MasukModelStatic>("Masuk", masukSchema);

    // create http server
    let port = 8001;
    let app = Server.bootstrap().app;
    app.set("port", port);
    MasukTest.server = http.createServer(app);
    MasukTest.server.listen(port);

    return MasukTest.createMasuk();
  }

  /**
   * After all hook
   */
  public static after() {
    return MasukTest.masuk.remove()
    .then(() => {
      return mongoose.disconnect();
    });
  }

  /**
   * Create a test masuk.
   */
  public static createMasuk(): Promise<MasukModel> {
    const data: Masuk = {
      akun: "hendra",
      sandi: "1234"
    };
    return new MasukTest.Masuk(data).save().then(masuk => {
      MasukTest.masuk = masuk;
      return masuk;
    });
  }

  @test public delete() {
    const data: Masuk = {
      akun: "hendra",
      sandi: "1234"
    };
    return new MasukTest.Masuk(data).save().then(masuk => {
      return chai.request(MasukTest.server).del(`${MasukTest.BASE_URI}/${masuk._id}`).then(response => {
        response.should.have.status(200);
      });
    });
  }

  @test public get() {
    return chai.request(MasukTest.server).get(`${MasukTest.BASE_URI}/${MasukTest.masuk._id}`).then(response => {
      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have.property("akun").eql(MasukTest.masuk.akun);
      response.body.should.have.property("sandi").eql(MasukTest.masuk.sandi);
    });
  }

  @test public list() {
    return chai.request(MasukTest.server).get(MasukTest.BASE_URI).then(response => {
      response.should.have.status(200);
      response.body.should.be.an("array");
      response.body.should.have.lengthOf(1);
    });
  }

  @test public post() {
    const data: Masuk = {
      akun: "hendra",
      sandi: "1234"
    };
    return chai.request(MasukTest.server).post(MasukTest.BASE_URI)
    .send(data)
    .then(response => {
      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have.a.property("_id");
      response.body.should.have.property("akun").eql(data.akun);
      response.body.should.have.property("sandi").eql(data.sandi);
      return MasukTest.Masuk.findByIdAndRemove(response.body._id).exec();
    });
  }

  @test public put() {
    const data: Masuk = {
      akun: "hendra",
      sandi: "1234"
    }
    return chai.request(MasukTest.server).put(`${MasukTest.BASE_URI}/${MasukTest.masuk._id}`)
    .send(data)
    .then(response => {
      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have.a.property("_id");
      response.body.should.have.property("akun").eql(data.akun);
      response.body.should.have.property("sandi").eql(data.sandi);
    });
  }

}