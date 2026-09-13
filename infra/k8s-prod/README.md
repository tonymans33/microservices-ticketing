# Production manifests

Applied by `.github/workflows/deploy-manifests.yaml` alongside `infra/k8s/`.
Dev uses `infra/k8s/` + `infra/k8s-dev/` via skaffold instead.

## Before the first real deploy

1. Replace `your-domain-here.com` in `ingress-srv.yaml` with your domain
   (both the `tls.hosts` entry and the `rules.host` entry).

2. Point the domain's DNS A record at the ingress LoadBalancer IP:

       kubectl get svc -n ingress-nginx ingress-nginx-controller

3. Install cert-manager and create the `letsencrypt-prod` ClusterIssuer that
   the `cert-manager.io/cluster-issuer` annotation refers to. Without it the
   TLS block does nothing and HTTPS will not work.
