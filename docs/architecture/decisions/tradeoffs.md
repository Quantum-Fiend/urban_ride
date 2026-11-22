# Architectural Decision Records - Trade-Off Analysis

| Dimension | Option A: Distributed Microservices | Option B: Modular Monolith (Selected) | Trade-Off Rationale |
| :--- | :--- | :--- | :--- |
| **Transaction Consistency** | Distributed Sagas / 2PC (Eventual consistency, high failure rate) | Local ACID Transactions (Spring `@Transactional`) | Trip booking and payment state require immediate consistency to prevent double-booking. Monolith guarantees atomic commit. |
| **Operational Overhead** | Multi-repo or complex mono-repo, 7+ deployments, service mesh, distributed tracing | Single artifact, single CI/CD pipeline, centralized metrics | Significantly lower infrastructure bills and zero distributed network serialization latency. |
| **Driver Location Ingestion** | PostGIS `ST_DWithin` queries on every ping | Redis In-Memory Geospatial (`GEOSEARCH`) | Redis operates in RAM with $O(\log N + M)$ complexity, handling 50k pings/sec with minimal CPU footprint. |
| **Client Rendering** | Traditional SPA (React CRA) | Next.js 15 App Router with SSR + Client Components | Faster first contentful paint (FCP), superior SEO for public rider landing pages, and native server action optimization. |
| **Real-time Transport** | Polling HTTP `/status` every 2s | Stomp over WebSocket (`/ws-ride`) | Eliminates millions of redundant HTTP polling headers; reduces server ingress bandwidth by 85%. |
