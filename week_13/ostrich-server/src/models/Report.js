import { Provide, injectClass } from "../../libs/kidi";
import { injectCollection } from "../../libs/kidi/plugins/kidi-mongodb";

@Provide("ReportModel")
export class ReportModel {
  getCollection(name) {
    let collection = injectCollection(name);
    return collection;
  }
}
