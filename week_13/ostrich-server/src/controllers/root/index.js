import { Controller, Exception, Schedule } from "../../../libs/kidi";
import ExceptionMiddleware from "../../middlewares/Exception.js";
import DataComputeSchedule from "../../schedules/DataCompute.js";

@Exception(ExceptionMiddleware)
@Schedule(DataComputeSchedule)
@Controller("/")
export default class RootController {}
