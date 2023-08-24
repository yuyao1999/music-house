/** @format */

import { Http } from "../axios/index"
class Pos {
  private http: Http
  private config = {
    //@ts-ignore
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 1000 * 30, //30秒,
  }
  private headersConfig = {
    Authorization: localStorage.getItem("token"),
  }
  constructor() {
    this.http = new Http(this.config, this.headersConfig)
  }

  /**
   *  登录
   */
  login(data: any) {
    return this.http.post("/park_user/logon_park_user_client", data)
  }
  /**
   * 获取全部票亭位置
   */
  getTicketBooth() {
    return this.http.get("/device_config/get_device_config_list")
  }
  /**
   * 选择或更换当班票亭位置
   */
  changeTicketBooth(data: any) {
    return this.http.post("/device_config/update_user_cashier_class", data)
  }
  /**
   * 现金收银
   */
  cash(data: any) {
    return this.http.get("/cashier_entry_record/update_cashier_entry_record_payment", data)
  }
  cash2(data: any) {
    return this.http.get("/cashier_entry_record/update_cashier_record_cash", data)
  }

  /**
   * 根据ID查询入口收银订单接口
   */
  getEntryRecord(data: any) {
    return this.http.get("/cashier_entry_record/get_cashier_record_one", data)
  }
  /**
   * 查询收银订单接口（分页）
   */
  getEntryRecordList(data: any) {
    return this.http.post("/cashier_entry_record/get_page_cashier_record", data)
  }
  /**
   * 查询班次数据接口（分页
   */
  getCashierClassList(data: any) {
    return this.http.post("/cashier_class/get_page_cashier_class", data)
  }
  /**
   * 出入口交班
   */
  handover(data: any) {
    return this.http.get("/cashier_class/update_cashier_class_end", data)
  }
  /**
   * 获取其他配置
   */
  getOtherConfig() {
    return this.http.get("/device_config/get_other_config")
  }
  /**
   * 修改洗车配置
   */
  updateWashConfig(data: any) {
    return this.http.get("/device_config/update_other_config", data)
  }
  /**
   * 修改订单--重量
   */
  updateWeight(data: any) {
    return this.http.post("/device_config/update_record_load", data)
  }
  /**
   * 修改订单--车牌号
   */
  updateCarNumber(data: any) {
    return this.http.post("/cashier_entry_record/update_record_car_number", data)
  }
  /**
   * 修改订单--放行
   */
  updateRelease(data: any) {
    return this.http.post("/cashier_entry_record/update_record_release", data)
  }
  /**
   * 根据班次ID获取未处理订单数据
   */
  getUnprocessedRecord(data: any) {
    return this.http.get("/cashier_entry_record/get_untreated_record", data)
  }
  /**
   * 无人值守项目-手动识别接口
   */
  manualRecognition(data: any) {
    return this.http.get("/cashier_entry_record/get_manual_distinguish", data)
  }
  /**
   * 异常空车订单处理
   */
  abnormalCar(data: any) {
    return this.http.get("/cashier_entry_record/update_cashier_record_abnormal", data)
  }
}
const posApi = new Pos()
export { posApi }
