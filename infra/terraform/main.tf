locals {
  website_endpoint = "${var.bucket_name}.website.yandexcloud.net"
  dns_zone_id      = var.create_yandex_dns_zone ? yandex_dns_zone.site[0].id : var.existing_dns_zone_id
}

data "yandex_cm_certificate" "site" {
  certificate_id = var.certificate_id
}
