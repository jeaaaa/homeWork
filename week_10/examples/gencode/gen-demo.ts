import fs from "fs";
import path from "path";
import { eleComponents } from "../constants";

const template = (name: string, text: string) => {
  const nameLow = name.replace(/^\w/, (s0: string) => s0.toLowerCase());
  return `
<template>
    <div class="page-${nameLow}">
        <h2>${text}</h2>
        <${name}></${name}>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { ${name} } from "@/ele";

export default defineComponent({
    name: 'Page${name}',
    components: { ${name} },
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
  let content = template(item[0], item[1]);
  console.log("..................");
  const fileName = path.join(__dirname, "../views", `${item[0]}.vue`);
  console.log(">", fileName);
  fs.writeFileSync(fileName, content, "utf8");
  console.log("..................");
});
