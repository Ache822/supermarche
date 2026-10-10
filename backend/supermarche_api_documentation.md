# Supermarche Express REST & Real-Time API Specification & Reference Manual

> Industry-standard developer documentation and technical integration guide for identity management, services catalog, provider onboarding, targeted emails, marketing campaigns, visitor analytics, live support chat, page-targeted FAQs, Knowledgebase Help Articles, instant search, article helpfulness voting, and free automatic EN/FR translations.

---

| API VERSION | PROTOCOL | BASE URL | FORMAT |
| :--- | :--- | :--- | :--- |
| **v1.4.0 (2026-08-20)** | **HTTPS / WSS / JSON** | **api.supermarche.cm/v1** | **Standard JSON / RFC 7807** |

---

## 1. Authentication & Base Environments

All REST API endpoints require secure access via HTTPS and Bearer Authentication. API tokens carry specific authorization scopes and should be passed in the HTTP header with every request.

### Environments

| ENVIRONMENT | BASE URL | SOCKET.IO WSS URL | TARGET USAGE |
| :--- | :--- | :--- | :--- |
| **Local / Staging** | `http://localhost:3000/api/v1` | `http://localhost:3000` | Integration testing, local development, and mock data verification. |
| **Local Wi-Fi** | `http://192.168.100.125:3000/api/v1` | `http://192.168.100.125:3000` | Multi-device testing (mobile devices & laptops on local Wi-Fi). |
| **Production** | `https://api.supermarche.cm/api/v1` | `https://api.supermarche.cm` | Live system execution and high-availability production workloads. |

> [!NOTE]
> **Token Expiration Policy**: JWT access tokens are valid for **7 Days** (`JWT_EXPIRES_IN=7d`). HTTP-Only authentication cookies carry a `maxAge` of 7 days (`604,800,000` ms).

> [!TIP]
> **ID Format Flexibility & CastError Safeguards**: All `:id` parameters support **both** 24-character hexadecimal MongoDB `ObjectIds` AND custom string identifiers (e.g. `USR-102`, `srv-gas`, `testim-1`, `faq-1`, `pro-onboarding-guide`). Missing, `undefined`, or `null` URL parameters safely return `404 Not Found` without throwing server errors.

---

## 2. Global Response Status Taxonomy

Our platform uses standard HTTP response status codes to communicate execution outcomes. Responses with status codes in the `4xx` or `5xx` range will include a JSON problem detail payload.

| STATUS | CODE NAME | DESCRIPTION & RECOVERY ACTION |
| :--- | :--- | :--- |
| **`200 OK`** | `SUCCESS` | Request completed successfully. Response body contains payload. |
| **`201 Created`** | `SUCCESS` | Resource successfully generated. |
| **`204 No Content`** | `SUCCESS` | Successful deletion or state change with no response body. |
| **`400 Bad Request`** | `VALIDATION_FAILED` | Request parameters failed validation checks. |
| **`401 Unauthorized`** | `UNAUTHORIZED` | Missing or invalid authentication token. |
| **`403 Forbidden`** | `FORBIDDEN` | Authenticated user lacks required permissions. |
| **`404 Not Found`** | `NOT_FOUND` | Resource matching identifier does not exist. |
| **`409 Conflict`** | `CONFLICT` | Resource collision (e.g. duplicate email address or slug). |
| **`500 Internal Error`** | `INTERNAL_ERROR` | An unhandled exception occurred on the server. |

---

## 3. Module Endpoint Specifications

### 3.1 Page-Targeted FAQs & Instant Search (`/faqs` & `/faqs/search`)

#### `GET /faqs` `Scope: Public`
Returns published FAQs filtered by target page (`page=home`, `become-a-provider`, `services`, `help`), category (`customers`, `pros`, `account`), or featured status. Supports `?lang=fr` for instant French localization.

**Query Parameters:**
- `page`: Page slug (`home`, `become-a-provider`, `services`, `help`, `all`).
- `category`: Audience category (`customers`, `pros`, `account`).
- `featured`: Filter by trending status (`true` / `false`).
- `lang`: Language code (`en` or `fr`).

#### `GET /faqs/search` `Scope: Public`
Instant case-insensitive regex search across FAQs (questions, answers, subcategories) and Knowledgebase Articles (titles, summaries, content).

**Query Parameters:**
- `q`: Search keyword (e.g. `gas`, `refund`, `momo`).
- `lang`: Language code (`en` or `fr`).

**Response Schema (`200 OK`):**
```json
{
  "query": "gas",
  "faqs": [
    {
      "id": "c-book-1",
      "question": "How do I book a service on Supermarche?",
      "answer": "Download the Supermarche Mobile App..."
    }
  ],
  "articles": [
    {
      "slug": "guide-to-supermarche-service-booking",
      "title": "Complete Guide to Booking Errand & Home Delivery Services",
      "summary": "Step-by-step instructions..."
    }
  ]
}
```

#### `GET /admin/faqs` `Scope: faqs:manage`
Returns all FAQs for the Admin Console including unpublished drafts and display order.

#### `POST /admin/faqs` `Scope: faqs:manage`
Creates a new FAQ. Automatically generates French translations (`translations.fr`) if not provided.

#### `PATCH /admin/faqs/:id` `Scope: faqs:manage`
Updates an existing FAQ. Auto-translates updated questions or answers to French.

#### `DELETE /admin/faqs/:id` `Scope: faqs:manage`
Permanently deletes an FAQ.

---

### 3.2 Knowledgebase Help Articles & Voting (`/articles` & `/articles/:id/vote`)

#### `GET /articles` `Scope: Public`
Returns all published Knowledgebase Articles ordered by display position. Supports category filtering and `?lang=fr`.

#### `GET /articles/:slug` `Scope: Public`
Returns a single Knowledgebase Article by its URL slug (or MongoDB ObjectId). Automatically increments page view count (`views`).

#### `POST /articles/:id/vote` `Scope: Public`
Submits a user helpfulness vote (👍 Yes / 👎 No). Atomically increments `helpfulCount` or `unhelpfulCount`.

**Request Payload:**
```json
{ "vote": "up" }
```
*(Also accepts `{ "vote": "down" }` or `{ "type": "helpful" }`)*

**Response Schema (`200 OK`):**
```json
{
  "success": true,
  "helpfulCount": 42,
  "unhelpfulCount": 1
}
```

#### `GET /admin/articles/list` `Scope: articles:manage`
Returns all articles (published and unpublished drafts) for the Admin Console.

#### `POST /admin/articles` `Scope: articles:manage`
Creates a new Knowledgebase Article. Automatically generates a clean URL slug if left blank, and auto-translates title, summary, and rich-text HTML content to French.

#### `PATCH /admin/articles/:id` `Scope: articles:manage`
Updates an article. Auto-translates updated content and updates `published_at` timestamp.

#### `DELETE /admin/articles/:id` `Scope: articles:manage`
Permanently deletes an article.

---

### 3.3 Services & Categories Catalog (`/services` & `/services/categories`)

#### `GET /services/categories` `Scope: Public`
Returns all active service categories. Supports `?parent=null` for top-level categories and `?lang=fr` for French localization.

#### `POST /admin/services/categories` `Scope: services:manage`
Creates a new service category. Auto-translates name and description to French.

#### `PATCH /admin/services/categories/:id` `Scope: services:manage`
Updates a service category. Auto-translates updated fields to French.

#### `DELETE /admin/services/categories/:id` `Scope: services:manage`
Deletes a service category.

#### `GET /services` `Scope: Public`
Returns all live services enriched with `categoryLabel`. Supports `?category=id`, `?featured=true`, and `?lang=fr`.

#### `GET /services/:id` `Scope: Public`
Returns details for a specific service by ID or slug.

#### `POST /admin/services` `Scope: services:manage`
Creates a new service item. Auto-translates title, description, and estimated time to French.

#### `PATCH /admin/services/:id` `Scope: services:manage`
Updates a service item. Auto-translates updated fields to French.

#### `PATCH /admin/services/batch-visibility` `Scope: services:manage`
Batch updates visibility (`isLive: true/false`) for multiple services simultaneously.

---

### 3.4 Bidirectional Automatic Translation Engine (`autoTranslateObject`)

When any dynamic content (FAQs, Articles, Categories, Services, Testimonials) is saved via Admin APIs:
- If `defaultLanguage` is `"en"`, the backend automatically calls `autoTranslateObject()` using Google Translate's engine to populate `translations.fr`.
- If `defaultLanguage` is `"fr"`, the backend automatically translates French to English and populates `translations.en`.
- Admins can explicitly pass custom translations inside `translations` to override automatic generation.

---

### 3.5 Marketing Campaigns & Email Broadcasts (`/campaigns` & `/newsletter`)

#### `GET /campaigns` `Scope: Public`
Returns published promotional campaign banners for website display.

#### `POST /campaigns/broadcast` `Scope: campaigns:manage`
Dispatches email broadcasts to subscribers. Accepts flexible Zod inputs (`title` or `subject`, `contentHtml` or `body`, `audience`, `targetCity`, `isDraft`).

#### `POST /newsletter/subscribe` `Scope: Public`
*(Alias: `/api/newsletter/subscribe`)*  
Registers a subscriber email. Emits a real-time `subscriber_updated` Socket.IO broadcast to connected admin dashboards.

---

### 3.6 Analytics Engine & Real-Time Visitor Logs (`/admin/analytics`)

#### `GET /admin/analytics/overview` `Scope: analytics:read`
Returns real-time database metric aggregations:
- Total Subscribers & 30-Day Growth Percentage.
- Device Category Breakdown (Desktop, Mobile, Tablet) calculated strictly from real-time database `VisitorLogs`.
- Geographic City Distribution & Traffic Acquisition Referrer Breakdown.

---

### 3.7 Customer Testimonials & Moderation (`/testimonials` & `/admin/testimonials`)

#### `GET /testimonials/featured` `Scope: Public`
Returns approved and featured reviews for the public landing page carousel.

#### `POST /testimonials` `Scope: Public`
Submits a new review (defaults to `PENDING` status for moderation).

#### `PATCH /admin/testimonials/:id/status` `Scope: testimonials:manage`
Updates approval status of a review (`APPROVED` | `REJECTED` | `PENDING`).

---

### 3.8 Live Support Chat Engine (`/support` & Socket.IO WSS)

#### REST Endpoints:
- `GET /support/chats`: List open customer chat sessions.
- `GET /support/chats/:session_id/messages`: Load chat history.
- `POST /support/chats/:session_id/messages`: Post message fallback.
- `POST /support/chats/:session_id/resolve`: Resolve support ticket.

#### Socket.IO Real-Time Event Protocol:
- **`join_chat`**: Emitted on widget open (`{ sessionId, customerName, city, topic }`).
- **`send_message`**: Emitted when sending message (`{ sessionId, sender, message, attachment }`).
- **`receive_message`**: Server broadcast to session participants.
- **`typing_indicator`**: Real-time typing status.
- **`subscriber_updated`**: Real-time server broadcast when a new email subscriber opts in (`{ totalSubscribers, subscriber }`).

---

### 3.9 Services Catalog & Image Uploads (`/services` & `/admin/services`)

#### `GET /services` `Scope: Public`
Returns active services catalog. Supports `?category=<categoryId>`, `?featured=true`, and `?lang=fr` for French translation.

#### `POST /services/upload` `Scope: pages:edit`
*(Alias: `POST /admin/services/upload`)*  
Uploads a service preview image in base64 format. Supported formats: `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, `.gif`.

**Request Body:**
```json
{
  "filename": "gas_delivery.png",
  "fileData": "data:image/png;base64,iVBORw0KGgoAAA..."
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "imageUrl": "/uploads/services/service_1715629102_a8b9c0.png"
}
```

#### `POST /services` `Scope: pages:edit`
Creates a new service item. Include the `imageUrl` returned from the upload endpoint.

**Request Body:**
```json
{
  "id": "srv-gas",
  "title": "Cooking Gas Delivery",
  "category": "6512bd8f4f1c2b001c890123",
  "description": "Instant delivery and installation of cooking gas cylinders.",
  "priceRange": "8,000 - 15,000 FCFA",
  "estimatedTime": "20-35 mins",
  "iconName": "Flame",
  "isLive": true,
  "featured": true,
  "imageUrl": "/uploads/services/service_1715629102_a8b9c0.png"
}
```

