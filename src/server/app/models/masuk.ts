import mongoose = require("mongoose");
import { Document, Model } from "mongoose";
import { Masuk as MasukInterface } from "../interfaces/masuk";
import { masukSchema } from "../schemas/masuk";

export interface MasukModel extends MasukInterface, Document {}

export interface MasukModelStatic extends Model<MasukModel> {}

export const Masuk = mongoose.model<MasukModel, MasukModelStatic>("Masuk", masukSchema, "masuk");