curl -i -X POST http://localhost:8080/api/detection/add \
  -H "Content-Type: application/json" \
  -d '{
    "defectNumber": 1,
    "detectConfidences": "0.5321, 0.0409, 0.6961, 0.1101",
    "hasInclusion": false,
    "hasOther": false,
    "hasPatch": false,
    "hasScratch": true,
    "resultFigure": "",
    "timeCost": 0.11002826690673828
  }'
