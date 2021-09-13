import { defineComponent, toRef, toRefs, computed, h, provide } from "vue";
import "@/theme/chalk/row.scss";

export default defineComponent({
  name: "Row",
  props: {
    tag: {
      type: String,
      default: "div",
    },
    gutter: {
      type: Number,
      default: 0,
    },
    justify: {
      type: String,
      default: "start",
    },
    align: {
      type: String,
      default: "top",
    },
  },
  setup(props, { slots }) {
    const { gutter } = toRefs(props);

    provide("Row", {
      gutter,
    });

    return () =>
      h(
        props.tag,
        {
          class: [
            "el-row",
            props.justify !== "start" ? `is-justify-${props.justify}` : "",
            props.align !== "top" ? `is-align-${props.align}` : "",
          ],
        },
        slots.default?.()
      );
  },
});
