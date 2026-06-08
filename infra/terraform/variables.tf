variable "cloud_id" {
  type = string
}

variable "folder_id" {
  type = string
}

variable "zone" {
  type    = string
  default = "ru-central1-a"
}

variable "domain_name" {
  type    = string
  default = "xn--80abjdnrwhz3i.xn--p1ai"
}

variable "bucket_name" {
  type    = string
  default = "xn--80abjdnrwhz3i.xn--p1ai"
}

variable "certificate_id" {
  type        = string
  description = "Yandex Certificate Manager certificate ID for the apex domain."
}

variable "terraform_sa_name" {
  type    = string
  default = "leti-pobeda-terraform-v2"
}

variable "deploy_sa_name" {
  type    = string
  default = "leti-pobeda-deploy"
}

variable "deploy_sa_roles" {
  type = set(string)
  default = [
    "storage.editor",
  ]
}

variable "create_deploy_static_access_key" {
  type    = bool
  default = true
}

variable "create_yandex_dns_zone" {
  type        = bool
  default     = false
  description = "Creates a public DNS zone in Yandex Cloud DNS. Keep false if authoritative DNS stays elsewhere."
}

variable "dns_zone_name" {
  type        = string
  default     = "leti-pobeda-zone"
  description = "Terraform resource name for the public Yandex Cloud DNS zone."
}

variable "existing_dns_zone_id" {
  type        = string
  default     = null
  nullable    = true
  description = "Existing Yandex Cloud DNS zone ID. Used when create_yandex_dns_zone=false."
}

variable "cdn_record_name" {
  type        = string
  default     = null
  nullable    = true
  description = "Optional subdomain label to point at the CDN from Yandex Cloud DNS, for example www or cdn."
}

variable "labels" {
  type    = map(string)
  default = {}
}
