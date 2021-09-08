import Vue from "vue";
import Base from "./base";

const EForm = {
    name: Base.name,
    install(vue, option = {}) {
        Vue.component(Base.name, Base);
        Vue.prototype.$EForm = option;
    }
};

export default EForm;
