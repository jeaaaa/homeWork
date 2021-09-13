import fs from "fs";
import path from "path";
import { eleComponents } from "../constants";

eleComponents.forEach((item) => {
  console.log("..................");
  const fileName = path.join(__dirname, "../views", `${item[0]}.vue`);
  console.log(">", fileName);
  if (fs.existsSync(fileName)) {
    fs.unlink(fileName, () => {});
  }
  console.log("..................");
});
