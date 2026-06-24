# Elasticsearch Query & Index Strategy

## Geospatial Queries
Used for finding nearby online drivers efficiently:
`json
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "status": "ONLINE" } },
        {
          "geo_distance": {
            "distance": "5km",
            "currentLocation": {
              "lat": 12.9716,
              "lon": 77.5946
            }
          }
        }
      ]
    }
  }
}
`

## Index Optimizations
1. Use **geo_point** field type for locations.
2. Enable autocomplete tokenizer on address search text fields.
