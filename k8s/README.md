# Passos para implantação

1. Crie o ConfigMap no seu Cluster Kubernetes:
```bash
kubectl apply -f configMap.yaml
```

2. Crie um Secret para armazenar a STATUSPAGE_API_KEY e STATUSPAGE_PAGE_ID:
```bash
kubectl create secret generic statuspage-secrets \
    --from-literal=STATUSPAGE_API_KEY=your-api-key \
    --from-literal=STATUSPAGE_PAGE_ID=your-page-id
```
3. Crie o Deployment no seu Cluster Kubernetes: 
```bash
kubectl apply -f deployment.yaml
```
