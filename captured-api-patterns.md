# Captured RIGHT2FIXAPPS.COM API Patterns

Based on network interception, here are the actual API calls made by right2fix.com:

## 1. search_pg_one - Main Product Search
- **Initial Load**: `GET https://right2fixapps.com/search_pg_one?&hitsSize=20&from=0`
- **With Search**: `GET https://right2fixapps.com/search_pg_one?refine_search=brake%20pads&hitsSize=20&from=0`

### Parameters:
- `hitsSize`: Number of results per page (default: 20)
- `from`: Pagination offset (0, 20, 40, etc.)
- `refine_search`: Search query (optional)

## 2. search_completion - Autocomplete
- **URL**: `GET https://right2fixapps.com/search_completion?search=brake%20pads`

### Parameters:
- `search`: The search query being typed

## 3. search_pg_three - Interchanges/Related Parts
- **Valid Call**: `GET https://right2fixapps.com/search_pg_three?req_type=intpage&id_codes=39278&dummy=no`
- **Invalid Call**: `GET https://right2fixapps.com/search_pg_three?req_type=intpage&id_codes=https://right2fix.com/?nav=Products&dummy=no` (returns 404)

### Parameters:
- `req_type`: Always "intpage" for interchange pages
- `id_codes`: Product ID or code (NOT URLs)
- `dummy`: Always "no"

## Key Observations:
1. search_pg_one is used for all product listings and searches
2. search_completion triggers on search input typing
3. search_pg_three expects numeric product IDs, not URLs
4. All APIs use GET method
5. No authentication headers required