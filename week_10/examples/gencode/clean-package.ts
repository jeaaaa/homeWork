import fs from "fs";
import path from "path";
import { eleComponents } from "../constants";

eleComponents.forEach((item) => {
    console.log("..................");
    const dirName = path.join(__dirname, "../../packages", item[0]);
    console.log(">", dirName);
    if (fs.existsSync(dirName)) {
        fs.rmdirSync(dirName, { recursive: true });
    }
    console.log("..................");
});
