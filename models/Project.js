import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true }, // we will store image path / URL
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
