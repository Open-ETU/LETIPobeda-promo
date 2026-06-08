resource "yandex_iam_service_account" "terraform" {
  name        = var.terraform_sa_name
  description = "Terraform infrastructure manager for LETIPobeda promo"
}

resource "yandex_iam_service_account" "deploy" {
  name        = var.deploy_sa_name
  description = "Static site deployer for LETIPobeda promo"
}

resource "yandex_resourcemanager_folder_iam_member" "deploy_roles" {
  for_each  = var.deploy_sa_roles
  folder_id = var.folder_id
  role      = each.value
  member    = "serviceAccount:${yandex_iam_service_account.deploy.id}"
}

resource "yandex_iam_service_account_static_access_key" "deploy" {
  count              = var.create_deploy_static_access_key ? 1 : 0
  service_account_id = yandex_iam_service_account.deploy.id
  description        = "S3 key for LETIPobeda static deploy"
}
