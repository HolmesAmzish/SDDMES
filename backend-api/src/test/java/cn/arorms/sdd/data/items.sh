curl -X POST http://localhost:8080/api/item/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "钢卷",
    "itemType": "RAW",
    "unit": "吨"
  }'

curl -X POST http://localhost:8080/api/item/delete?id=2