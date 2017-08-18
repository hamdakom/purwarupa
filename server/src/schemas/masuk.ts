import { Schema } from "mongoose";

export var masukSchema: Schema = new Schema({
  akun: String,
  sandi: String
});