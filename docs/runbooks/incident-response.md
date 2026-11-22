# Incident Response Runbook

## Severity Levels
- **P0 (Critical Outage)**: Core ride booking or payment capture down across an entire metropolitan region. MTTA: $\le 5\text{ min}$; MTTR: $\le 30\text{ min}$.
- **P1 (Degraded Performance)**: Latency spikes above 1s; driver location updates delayed. MTTA: $\le 15\text{ min}$; MTTR: $\le 2\text{ hours}$.
- **P2 (Minor Issue)**: Non-critical analytics dashboard delay or admin portal filtering bug. MTTA: $\le 1\text{ hour}$.

## Incident Command Protocol
1. **Declare Incident**: Automated PagerDuty alarm triggers on Prometheus alert rule `HighHttp5xxRate` or `DatabaseConnectionExhaustion`.
2. **Assign Incident Commander (IC)**: IC sets up emergency bridge and updates status page.
3. **Isolate**: Divert traffic to secondary region or enable read-only graceful degradation.
4. **Post-Mortem**: Publish blameless post-mortem document within 48 hours including root cause, timeline, and preventive JIRA action items.
