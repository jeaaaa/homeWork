export default {
    props: {
        value: {
            type: [String, Number, Array, Date, Boolean],
            default: ""
        },
        formDatas: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {};
    },
    watch: {
        formDatas() {
            // console.log(val, 2222222);
        }
    },
    methods: {
        e__input(val) {
            this.$emit("input", this.formDatas.name, val);
            this.$emit("event", this.formDatas);
        }
    }
};
