import Vue from 'vue'
import TimePicker from 'ant-design-vue/lib/time-picker'
import DatePicker from 'ant-design-vue/lib/date-picker'
import 'ant-design-vue/lib/date-picker/style/css'
import 'ant-design-vue/lib/time-picker/style/css'
import antInputDirective from 'ant-design-vue/es/_util/antInputDirective'

Vue.component('DatePicker', DatePicker)
Vue.component('TimePicker', TimePicker)

Vue.use(antInputDirective)
