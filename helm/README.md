#### Create namespace
```shell
kubectl create namespace fin-processor
```
#### Delete namespace
```shell
kubectl delete namespace fin-processor
```
### Install chart
```shell
helm install fin-processor-ui ./fin-processor-ui \
  -n fin-processor \
  --values ./fin-processor-ui/values.yaml
```
### Show manifest
```shell
helm get manifest -n fin-processor fin-processor-ui
```
### Verify installation
```shell
kubectl get all -n fin-processor
```
### Get pod logs
```shell
kubectl logs -n fin-processor fin-processor-ui-<ID>
```
### Describe pod
```shell
kubectl describe -n fin-processor pod/fin-processor-ui-<ID>
```
### Get pod events
```shell
kubectl events -n fin-processor fin-processor-ui-<ID>
```
### Verify external access
```shell
nc -vz $(minikube ip) 80
```
### Uninstall chart
```shell
helm uninstall -n fin-processor fin-processor-ui
```
