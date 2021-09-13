import fs from "fs";
import path from "path";
import { eleComponents } from "../constants";

const template = (name: string) => {
    return `export { default as ${name} } from "./${name}/${name}.vue";`;
};

//导出文件
let content = eleComponents.map((item) => {
    return template(item[0]);
});
const file = path.join(__dirname, "../../packages/ele.ts");
fs.writeFileSync(file, content.join("\n"), "utf8");
