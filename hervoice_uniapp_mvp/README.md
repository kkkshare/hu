# HerVoice Daily Uni-app MVP

## 已实现
- Uni-app 页面结构，可直接放入微信小程序工程
- 今日自动定位（无今日数据时回退到最近历史）
- 农历稳定格式（内置 1900-2099 农历换算）
- 云端 JSON 拉取（失败自动回退本地 JSON）
- 日签海报生成（1080x1440）
- 小红书风格海报模板 3 套可切换

## 目录
- `pages/index/index.vue` 首页
- `utils/dataService.js` 云端/本地数据
- `utils/lunar.js` 农历转换
- `utils/posterTemplates.js` 海报模板
- `static/data/hervoice_quotes_2026.json` 本地语录数据

## 使用
1. 在 HBuilderX 新建 uni-app 项目。
2. 将本目录文件拷贝到项目根目录。
3. 修改 `utils/dataService.js` 中 `CLOUD_DATA_URL` 为真实线上 JSON 地址。
4. 运行到微信开发者工具预览。
