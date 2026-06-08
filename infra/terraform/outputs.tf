output "bucket_name" {
  value = var.bucket_name
}

output "website_endpoint" {
  value = local.website_endpoint
}

output "cdn_resource_id" {
  value = yandex_cdn_resource.site.id
}

output "cdn_provider_cname" {
  value = yandex_cdn_resource.site.provider_cname
}

output "terraform_service_account_id" {
  value = yandex_iam_service_account.terraform.id
}

output "deploy_service_account_id" {
  value = yandex_iam_service_account.deploy.id
}

output "yandex_dns_zone_id" {
  value = local.dns_zone_id
}
