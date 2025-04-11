# 图像检测 api

## 图片检测

接收一批图片并返回模型输出。

```http
POST /api/detect/
```

表单数据：

- images: 图片列表，包含图片二进制流与文件名信息。

```json
[
    {
        "defect_count": 缺陷数量,
        "dice": 分类置信度,
        "labels": 分类标签,
        "name": 文件名,
        "processing_time": 处理时间,
        "result_image": 图片编码
    },
    ...
]
```



# 数据服务 api

## 获取最近记录

获取最近几条记录，返回结果实体。**数据可视化分析**和**ai分析**调用这个 api 进行进一步数据处理。

```http
GET /api/data/getRecent
```

参数：
- limit: 可选，最近数据的数量，不填默认120条。

返回：
```json
[
  {
  "figId": 图片编号,
  "name": 文件名,
  "date": 日期,
  "time": 检测时间,
  "label": 检测标签,
  "num": 缺陷数量,
  "dice": 分类置信度
  },
  ...
]
```

## 获取数据调用量

获取最近 api 调用量，统计记录数量和检查出的缺陷数量。

```http
GET /api/data/statByDate
```

参数：两个都可不填，默认从当前时间往后 15 天
- startDate: 起始日期
- endDate: 结束日期

返回：
```json
[
  {
    "record_count": 记录数量,
    "stat_date": 日期,
    "total_num": 缺陷总数
  },
  ...
]
```

## 分页查询（弃用）

简单的分页查询页码，每页显示特定数量的结果，本 api 被搜索功能代替。

```http
GET /api/data/getPaginated
```

参数：
- limit： 每一页显示的结果数量
- page： 页数

## 条件搜索

通过条件筛选结果，同时支持分页显示。

```http
GET /api/data/search
```

参数：
- limit: 每页显示的结果数量
- page： 页数
- name： 可选，选后添加模糊匹配条件
- num： 可选，选后添加匹配指定缺陷数量的条件
- startDate： 可选，起始日期
- endDate: 可选，结束日期

返回：

```json
{
  "total": 总数,
  "data": [
    {
      "figId": 结果id,
      "name": 图片名称,
      "resFig": null,
      "date": 日期,
      "time": 时间,
      "label": 分类标签,
      "num": 缺陷数量,
      "dice": null
    },
    ...
  ]
}
```



# AI 

```
sk-c6c11ae0a25a4e1ea64ff97e98d4057a
```

