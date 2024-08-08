# ConnectorMetrics

ConnectorMetrics is a service that collects Prometheus metrics through PromQL and exports the result to System Metrics of your StatusPage page.

### Example

Metric collection
```yaml
promql:
  - metric_id: xqrnhm62r7kd
    query: 'avg(probe_http_duration_seconds)'
```
View on StatusPage
![image](/example.png)

## Prerequisites

1. Node.js (v14+)
2. Docker
3. A Atlassian Statuspage account
4. Page and Components configured in Atlassian Statuspage and the page and component ids.
5. Your Atlassian Statuspage API key
6. Your Atlassian Statuspage Page ID 
7. Prometheus Server available

## Usage

### 1. Environment variables:

#### Required:

In the project root directory, create a .env file with your environment variables:

```sh
PROMETHEUS_URL=http://localhost:9090/api/v1/query
API_KEY=your-api-key
PAGE_ID=your-page-id
```

#### Optional:

To use the Makefile to build and push the Docker image to the GCP Artifact Registry:

```makefile
PROJECT_ID :=  
REGION := 
REPO_NAME := 
IMAGE_NAME := 
```

### 2. Start Application

#### Local

In the project root directory, run:

```sh
node src/index.mjs
```

### Docker

Create Docker image:
```sh
docker build -t your-image-name:tag .
```

Execute Docker container:
```sh
docker run -d --name connector-metrics -p 9137:9137 --env-file .env your-image-name:tag
```

Check Metrics
```sh
curl http://localhost:9137/metrics
```

### Kubernetes

1. Create a ConfigMap for queries.yaml

Create a ConfigMap in Kubernetes to store the contents of the queries.yaml file:

```sh
kubectl apply -f ./k8s/configMap.yaml
```

2. Create a Secret for API_KEY and PAGE_ID
```sh
kubectl create secret generic statuspage-secrets \
  --from-literal=API_KEY=your-api-key \
  --from-literal=PAGE_ID=your-page-id
```

3. Create a Deployment

```sh
kubectl apply -f ./k8s/deployment.yaml
```

4. Create a Service to expose the application:

```sh
kubectl apply -f ./k8s/service.yaml
```