resource "yandex_dns_zone" "site" {
  count       = var.create_yandex_dns_zone ? 1 : 0
  name        = var.dns_zone_name
  description = "DNS zone for LETIPobeda promo"
  zone        = "${var.domain_name}."
  public      = true
  labels      = var.labels
}

resource "yandex_dns_recordset" "cdn_subdomain" {
  count = local.dns_zone_id != null && var.cdn_record_name != null ? 1 : 0

  zone_id     = local.dns_zone_id
  name        = "${var.cdn_record_name}.${var.domain_name}."
  type        = "CNAME"
  ttl         = 300
  data        = [yandex_cdn_resource.site.provider_cname]
  description = "Subdomain CNAME to Yandex Cloud CDN"
}
