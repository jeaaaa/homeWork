export default class Service {
    constructor(app) {
        this.app = app;
        this.services = {};
    }
    create(name, Clas, injection) {
        let ins = injection.map(item => {
            if (this.app.models.models[item]) {
                return this.app.models.models[item];
            } else if (this.app.services.services[item]) {
                return this.app.services.services[item];
            }
            throw Error(`${item} 依赖注入失败`);
        })
        this.services[name] = new Clas(...ins);
    }
}
