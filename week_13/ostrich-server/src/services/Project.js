import ProjectModel from "../models/Project";
import { Provide, inject } from "../../libs/kidi/decorator";

@Provide("ProjectService")
export class Project {
  constructor() {
    this.model = inject("ProjectModel");
  }

  add(data) {
    data.created_at = new Date();
    data.updated_at = new Date();
    return this.model.add(data);
  }

  findAndCount(query) {
    return this.model.findAndCount(query);
  }
}
