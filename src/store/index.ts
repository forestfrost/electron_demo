import { createPinia } from "pinia";
import PiniaPersist from "pinia-plugin-persist";
const store = createPinia();
store.use(PiniaPersist);
export default store;
