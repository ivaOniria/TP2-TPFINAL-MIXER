import mongoose from "mongoose";

const soundSchema = mongoose.Schema({ 
    title: String,
    url: String,
    type: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    }

},{versionKey: false})

export const soundsModel = mongoose.model('sounds', soundSchema)