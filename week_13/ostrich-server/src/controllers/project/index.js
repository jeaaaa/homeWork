import {
    Controller,
    Get,
    Post,
    Exception,
    Provide,
    inject,
} from "../../../libs/kidi";
import ExceptionMiddleware from "../../middlewares/Exception.js";

@Exception(ExceptionMiddleware)
@Controller("/project")
export default class ProjectController {
    @Post("add")
    async add(req, res, context) {
        console.log("req.body>>>", req.body);
        let service = inject("ProjectService");
        let result = await service.add(req.body);
        res.json({
            code: 200,
            msg: "",
            data: {
                list: result,
            },
        });
    }

    @Get("list")
    async list(req, res, context) {
        let { page, pageSize } = req.query;
        if (page === undefined || pageSize === undefined) {
            res.json({
                code: 400,
                msg: "参数错误，page, pageSize必传",
            });
            return;
        }
        let service = inject("ProjectService");
        let [list, count] = await service.findAndCount({
            skip: page * pageSize,
            take: pageSize,
        });
        res.json({
            code: 200,
            msg: "",
            data: { list, total: count },
        });
    }
}
