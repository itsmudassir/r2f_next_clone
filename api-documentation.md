# RIGHT2FIX API Documentation

## Base URLs
- Main site: `https://right2fix.com`
- API server: `https://right2fixapps.com`

## Discovered Endpoints

### 1. Initial Page Load APIs

#### Search Page Three (Interchanges)
- **URL**: `https://right2fixapps.com/search_pg_three`
- **Method**: GET
- **Parameters**:
  - `req_type`: "intpage"
  - `id_codes`: "39278" (or page URL)
  - `dummy`: "no"
- **Purpose**: Loads interchange/related parts data

#### Search Page One (Product Listing)
- **URL**: `https://right2fixapps.com/search_pg_one`
- **Method**: GET
- **Parameters**:
  - `hitsSize`: 20 (items per page)
  - `from`: 0 (pagination offset)
- **Purpose**: Main product search/listing

#### Elasticsearch Multi-Get
- **URL**: `https://right2fix.com/elasticsearch/mget`
- **Method**: POST
- **Purpose**: Bulk data retrieval

### 2. User Tracking APIs
- `POST https://right2fix.com/user/hi` - User session init
- `POST https://right2fix.com/user/m` - User activity tracking
- `POST https://right2fix.com/user/apm` - Application performance monitoring

### 3. Search Autocomplete API
- **URL**: `https://right2fixapps.com/search_completion`
- **Method**: GET
- **Parameters**:
  - `search`: search query (e.g., "brake pads")
- **Purpose**: Returns search suggestions while typing

### 4. Search Results API
- **URL**: `https://right2fixapps.com/search_pg_one`
- **Method**: GET
- **Parameters**:
  - `refine_search`: search term (e.g., "brake pads")
  - `hitsSize`: 20 (items per page)
  - `from`: 0 (pagination offset)
- **Purpose**: Returns search results with refinement

## API Analysis

### Key Findings:
1. **Main Product Search**: Uses `search_pg_one` with parameters:
   - Default listing: `hitsSize=20&from=0`
   - With search: `refine_search=<term>&hitsSize=20&from=0`

2. **Interchanges/Related Parts**: Uses `search_pg_three` with:
   - `req_type=intpage`
   - `id_codes=<product_id or page_url>`
   - `dummy=no`

3. **Elasticsearch**: The site uses Elasticsearch for product data:
   - `POST /elasticsearch/mget` for bulk retrieval

4. **Search Completion**: Real-time search suggestions via:
   - `GET /search_completion?search=<query>`

### Filter Structure
Based on the UI, filters include:
- Availability
- Brands
- Categories (with subcategories)
- Refine Search
- Ratings
- Reviews
- Price
- Stores
- Attributes
- Vehicle Application

### Additional Parameters to Test:
- Pagination: Modify `from` parameter (0, 20, 40, etc.)
- Filter combinations
- Sort options
- Price ranges

## Implementation Notes for Clone:
1. Create proxy endpoints in Next.js to call RIGHT2FIX APIs
2. Implement caching to reduce API calls
3. Add error handling for 404 responses
4. Consider rate limiting to avoid overwhelming their servers