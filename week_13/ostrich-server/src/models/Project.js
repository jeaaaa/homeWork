import { Provide, injectClass } from "../../libs/kidi";
import { injectRepository } from "../../libs/kidi/plugins/kidi-mysql";

@Provide("ProjectModel")
export class ProjectModel {
  constructor() {
    const ProjectDto = injectClass("ProjectDto");
    this.repository = injectRepository(ProjectDto);

    let names = Object.getOwnPropertyNames(this.repository);
    names.forEach((method) => {
      this[method] = this.repository[method];
    });
  }
}
