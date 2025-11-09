# AidAtlas Technical Architecture & Delivery Plan

## 1. Product Framing
- **Vision**: Mobile-first humanitarian donation companion that simplifies discovery, engagement, and impact tracking for conflicts worldwide.
- **Primary personas**: Socially conscious Gen Z/Millennial donors who feel overwhelmed choosing where to donate; returning donors seeking more engaging experience; globally aware users following conflicts.
- **North-star outcomes**: Higher swipe-to-donate conversion, recurring donation adoption, transparent impact reporting, sustained retention through gamification.

## 2. Platform Overview
AidAtlas will ship as a cross-platform mobile app (React Native + Expo) backed by modular services:
- **API Gateway** fronting modular Node.js and Python services.
- **Core Services**: User/Auth Service (Node.js), Content Service (Python), Payment Service (Node.js), Recommendation Engine (Python FastAPI), Event Stream (Kafka/Kinesis equivalent via managed service), Background Workers (Airflow, Celery or Temporal for jobs), Real-time Map Service (Node.js + WebSockets).
- **Data Stores**: PostgreSQL (primary OLTP), Redis (cache, session, gamification counters), Elasticsearch (conflict/org search), S3 or GCS (content + data lake), Pinecone (vector search), Stripe (payments state), Mixpanel/Segment (analytics).

## 3. Functional Architecture
### 3.1 Onboarding & Authentication
- **Firebase Auth** (email + OAuth) + custom user profile DB in Postgres.
- **Preference quiz** stored in `UserPreferences` table; initial quiz built with React Hook Form + Zod on the client, validated server-side.
- **Profile service** exposes REST endpoints: `POST /users`, `PUT /users/:id/preferences`, `GET /users/me`.

### 3.2 Personalization & Recommendations
- **Event ingestion**: mobile client emits user events via Segment → Kafka topic → feature store (Redis) + warehouse (S3 + Snowflake/BigQuery for analytics).
- **Recommendation Engine**: FastAPI service hosting hybrid CF + content-based models, backed by feature store and offline training jobs.
- **Cold start**: quiz output seeds initial recommendation vector.
- **Real-time scoring**: request-time features computed from Redis; fallback to cached `RecommendationScore` table.

### 3.3 Conflict & Organization Content
- **CMS**: Strapi headless CMS with custom plugins for conflict entities; editors manage curated content.
- **Scraping pipeline**: Scrapy spiders → SQS queue → Lambda/Celery workers → summarization LLM (Claude) via LangChain orchestration → fact-checking module; persisted in data lake & normalized into Postgres + Elasticsearch.
- **Card API**: GraphQL or REST endpoints aggregated by Content Service returning conflict+organization cards with media, stats.

### 3.4 AI Summaries & Moderation
- **Prompt management**: versioned prompts in Git (LangChain), stored in S3.
- **Summaries**: asynchronous generation, persisted with metadata (confidence, sources). Human review queue for low-confidence results.
- **Moderation**: OpenAI Moderation API + custom keyword heuristics before publication.

### 3.5 Donations & Payments
- **Stripe Connect** for marketplace-like routing; AidAtlas acts as platform account.
- **Donation flow**: client collects payment intent via Stripe SDK → Payment Service finalizes charge, records `Donation` & `RecurringDonation` rows, triggers receipts via SendGrid.
- **Security**: Stripe handles PCI; payment service manages webhook signatures, encrypts sensitive fields (e.g., tax ID) with KMS-managed keys.

### 3.6 Impact Reporting
- **Monthly batch job** (Airflow) aggregates donation + organization updates → generates personalized reports via templating (React Email) → PDF (Puppeteer) + HTML emails.
- **In-app feed**: React Native section pulling `ImpactReport` summaries & `OrganizationUpdate` stories.

### 3.7 Live Donation Map
- **Real-time flow**: donation events published to Redis Pub/Sub → WebSocket service broadcasts anonymized aggregates → Mapbox GL front-end renders arcs; aggregation buckets by region & amount range.

### 3.8 Gamification & Badges
- **Achievement engine**: rule-based worker listens to event stream; updates Redis counters and writes `UserBadge` records.
- **Notifications**: Firebase Cloud Messaging triggered when new badge awarded; optional share links generated via Branch.io.

### 3.9 Trust & Verification Layer
- **Data sync**: Scheduled jobs fetch Charity Navigator, GuideStar data; manual review admin portal to adjudicate status.
- **Audit trails**: all verification decisions logged; user-reported concerns create support tickets (Zendesk integration).

## 4. Data Model Snapshot
Key entities (PostgreSQL):
- `User`, `UserPreferences`, `UserBehavior`, `RecommendationScore`
- `Conflict`, `Organization`, `ConflictOrganization`
- `Donation`, `RecurringDonation`, `ImpactReport`, `OrganizationUpdate`
- `Action` (protests/petitions), `UserBadge`, `OrganizationVerification`
Supplementary stores: Redis (feature cache, counters), Pinecone (embeddings), Elasticsearch (search), S3/GCS (raw content).

## 5. Delivery Roadmap
### Phase 0 – Foundations (Weeks 0-2)
- Team setup, repo scaffolding (monorepo using Turborepo), CI/CD (GitHub Actions), environment config (dev/staging/prod).
- Provision cloud accounts, Stripe, Firebase, Mixpanel, Sentry.

### Phase 1 – MVP (Months 0-3)
- Build onboarding/auth flows, preference quiz, manual content cards (5-10 conflicts seeded via CMS).
- Integrate Stripe one-time donations, basic donation history.
- Impact reporting v0 (simple email summaries).
- Instrument analytics & event tracking.

### Phase 2 – Core Features (Months 3-6)
- Launch AI content pipeline + summarization.
- Deploy recommendation engine v1 (hybrid model) and recurring donations.
- Introduce basic badge system, verification workflows.

### Phase 3 – Engagement (Months 6-8)
- Implement live donation map, protests/petitions feed, advanced gamification + social sharing.
- Expand impact reporting with richer visualization & stories.

### Phase 4 – Scale & Optimization (Month 9+)
- Iterate on ML models, expand integrations, performance tuning, internationalization, growth experiments.

## 6. Technical Decisions & Rationale
- **React Native + Expo**: single codebase across iOS/Android; strong library ecosystem (Reanimated, React Native Paper).
- **Monorepo with Turborepo**: shared types, CI caching, cohesive developer experience for Node/React Native/Python packages.
- **Node.js (Express/Fastify)** for user/payment services due to Stripe ecosystem support and existing Firebase tooling.
- **Python FastAPI** for ML/recommendation + content ingestion due to Python ML libraries.
- **PostgreSQL**: relational integrity for financial & user data; PostGIS extension for geospatial queries (actions map).
- **Redis**: low-latency feature cache, gamification counters, WebSocket pub/sub.
- **Elasticsearch**: advanced conflict/org search, filtering by tags, full-text.
- **Kafka/Kinesis**: scalable event pipeline for personalization metrics, badges, analytics.
- **Airflow**: orchestrate scraping, summarization, reporting jobs.
- **Stripe Connect**: marketplace donation routing w/ compliance built-in.

## 7. Security, Privacy, & Compliance
- Enforce OAuth + MFA for admins; least privilege IAM roles.
- Encrypt PII & financial identifiers (KMS / Vault).
- Anonymize analytics events; aggregate donation map to buckets.
- GDPR/CCPA compliance: data export/delete endpoints, consent management, privacy policy.
- Content moderation pipeline to avoid graphic/biased material; human-in-loop for sensitive topics.
- Audit logs for donations, verification decisions, admin changes.

## 8. Observability & Ops
- **Monitoring**: Datadog for infra metrics, Sentry for errors, structured logging (OpenTelemetry).
- **CI/CD**: GitHub Actions running lint/test/build; deploy via Terraform-managed infrastructure (AWS ECS/Fargate or GCP Cloud Run).
- **Feature flags**: LaunchDarkly for gradual rollouts, A/B tests.
- **Incident response**: on-call rotation, runbooks, status page integration.

## 9. Open Questions / Risks
- Long-term cost mgmt for LLM usage; evaluate on-prem Llama for low-priority summaries.
- Data licensing for conflict sources; ensure compliance.
- International payout compliance when scaling beyond initial NGO partners.
- Content accuracy & bias mitigation; plan for human editorial review.
- Legal review for acting as intermediary in donations per jurisdiction.

## 10. Immediate Next Steps
1. Finalize core stack decisions and provisioning (Firebase, Stripe, CMS).
2. Set up monorepo scaffolding with shared config (ESLint, Prettier, TypeScript base).
3. Implement MVP service contracts (user, content stub, donations) + mobile onboarding prototype.
4. Define analytics/events schema; instrument Segment/Mixpanel.
5. Begin NGO partnership outreach for initial curated organizations.

