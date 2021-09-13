import fs from "fs";
import path from "path";
import { eleComponents } from "../constants";

// import "@/theme/chalk/${nameLow}.scss";

const template = (name: string) => {
    const nameLow = name.replace(/^\w/, (s0: string) => s0.toLowerCase());
    return `
<template>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";


export default defineComponent({
    name: '${name}',
    setup(props, { emit, slots }) {
        return {
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
`;
};

eleComponents.forEach((item) => {
    let content = template(item[0]);
    console.log("..................");
    const dirName = path.join(__dirname, "../../packages", item[0]);
    fs.mkdirSync(dirName);

    const fileName = path.join(dirName, `${item[0]}.vue`);
    fs.writeFileSync(fileName, content, "utf8");
    console.log("..................");
});
