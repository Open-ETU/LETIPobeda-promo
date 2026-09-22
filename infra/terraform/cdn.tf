resource "yandex_cdn_origin_group" "site" {
  name     = "leti-pobeda-origin-group"
  use_next = true

  origin {
    source = local.website_endpoint
  }
}

resource "yandex_cdn_resource" "site" {
  cname           = var.domain_name
  active          = true
  secondary_hostnames = ["www.${var.domain_name}"]
  origin_protocol = "http"
  origin_group_id = yandex_cdn_origin_group.site.id
  labels          = var.labels

  options {
    custom_host_header     = local.website_endpoint
    redirect_http_to_https = true
    gzip_on                = true

    # Cache-Control from uploaded objects remains the primary cache policy.
    # Use origin Cache-Control in browsers too; immutable assets retain a one-year TTL.
    # This edge TTL is only a fallback when origin metadata is missing.
    edge_cache_settings    = 60

    static_response_headers = {
      x-robots-tag = "all"
    }
  }

  ssl_certificate {
    type                   = "certificate_manager"
    certificate_manager_id = data.yandex_cm_certificate.site.id
  }
}
