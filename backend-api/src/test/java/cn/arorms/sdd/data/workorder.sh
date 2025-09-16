#!/bin/bash

# Work Order API Test Script

echo "=== Testing Work Order API ==="

# Get all work orders
echo -e "\n1. Getting all work orders:"
curl -X GET http://localhost:8080/api/workorder/get \
  -H "Content-Type: application/json"

# Add a new work order
echo -e "\n\n2. Adding a new work order:"
curl -X POST http://localhost:8080/api/workorder/add \
  -H "Content-Type: application/json" \
  -d '{
    "workOrderNo": "WO-2024-001",
    "productionQuantity": 100.5,
    "productItem": {
      "id": 1
    },
    "bom": {
      "id": 1
    }
  }'

# Add another work order
echo -e "\n\n3. Adding another work order:"
curl -X POST http://localhost:8080/api/workorder/add \
  -H "Content-Type: application/json" \
  -d '{
    "workOrderNo": "WO-2024-002",
    "productionQuantity": 250.0,
    "productItem": {
      "id": 2
    },
    "bom": {
      "id": 2
    }
  }'

# Get all work orders again to see the new entries
echo -e "\n\n4. Getting all work orders after adding:"
curl -X GET http://localhost:8080/api/workorder/get \
  -H "Content-Type: application/json"

echo -e "\n\n=== Work Order API Test Completed ==="


curl -X GET http://localhost:8080/api/workorder/getStatuses
  -H "Content-Type: application/json"