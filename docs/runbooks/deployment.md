# Deployment Runbook

## Target Environment: Cloud-Native Kubernetes (AWS EKS)

### 1. Build & Push Docker Images
```bash
# Backend Image
docker build -t ridesphere/backend:1.0.0 -f infrastructure/docker/backend.Dockerfile .

# Frontend Multi-App Image
docker build -t ridesphere/frontend:1.0.0 -f infrastructure/docker/frontend.Dockerfile .

# Push to Registry
docker push ridesphere/backend:1.0.0
docker push ridesphere/frontend:1.0.0
```

### 2. Kubernetes Deployment Steps
```bash
# 1. Apply namespaces & configs
kubectl apply -f infrastructure/kubernetes/namespaces/
kubectl apply -f infrastructure/kubernetes/configmaps/
kubectl apply -f infrastructure/kubernetes/secrets/

# 2. Deploy services & pods
kubectl apply -f infrastructure/kubernetes/services/
kubectl apply -f infrastructure/kubernetes/deployments/
kubectl apply -f infrastructure/kubernetes/hpa/

# 3. Configure Ingress & SSL
kubectl apply -f infrastructure/kubernetes/ingress/
```

### 3. Canary & Rollback Strategy
Rollouts use Kubernetes rolling updates with `maxSurge: 25%` and `maxUnavailable: 0`.
If error rates exceed 0.5% during canary rollout:
```bash
kubectl rollout undo deployment/ridesphere-backend -n ridesphere
```
