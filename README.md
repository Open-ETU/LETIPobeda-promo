# LETIPobeda-promo

Сайт для восхищения о величии Первого Электротехнического.

## Infra

В репозитории добавлена заготовка инфраструктуры для миграции статики на Yandex Cloud:

- `infra/terraform` описывает Object Storage bucket, public-read policy, CDN, service accounts и опциональную DNS zone.
- `.github/workflows/deploy.yml` собирает `frontend`, публикует `dist/` в Object Storage и сбрасывает CDN cache.

### Что важно про DNS

Для корневого домена `xn--80abjdnrwhz3i.xn--p1ai` есть техническое ограничение:

- Yandex Cloud CDN ожидает привязку домена через `CNAME` к `provider_cname`.
- В Yandex Cloud DNS для apex можно использовать `ANAME`, но документация Yandex Cloud прямо не рекомендует `ANAME` для CDN, потому что ответ перестаёт быть геораспределённым.

Практический вывод:

- Для миграции основного домена безопаснее оставить authoritative DNS в Cloudflare, но перевести запись в режим `DNS only` и использовать apex `CNAME` flattening.
- Если нужен полностью Yandex-only authoritative DNS, лучше раздавать CDN на поддомене вроде `www`, а apex редиректить на него отдельным слоем. Текущий Terraform не создаёт заведомо проблемный apex `ANAME` под CDN.

## Terraform

Каталог: `infra/terraform`

1. Скопируйте пример переменных:

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
```

2. Заполните:

- `cloud_id`
- `folder_id`
- `certificate_id`
- `terraform_sa_name`, если Terraform service account уже создан вручную

3. Инициализируйте Terraform:

```bash
terraform init
terraform plan
```

### Existing bucket

Bucket `xn--80abjdnrwhz3i.xn--p1ai` уже существует и сейчас не управляется Terraform. Terraform использует только его static website endpoint как origin для CDN:

```text
xn--80abjdnrwhz3i.xn--p1ai.website.yandexcloud.net
```

Такой режим выбран потому, что импорт существующего bucket через Terraform provider может требовать S3-владельца bucket и падать с `403 Forbidden`, даже когда folder IAM роли выданы. Bucket policy и website-настройки нужно проверять через Yandex Cloud Console или `yc storage bucket get`.

### Что создаёт Terraform

- `yandex_cdn_origin_group.site`
- `yandex_cdn_resource.site`
- `yandex_iam_service_account.terraform`
- `yandex_iam_service_account.deploy`
- `yandex_iam_service_account_static_access_key.deploy`
- опционально `yandex_dns_zone.site`
- опционально `yandex_dns_recordset.cdn_subdomain`

### Output values

Полезные outputs после `apply`:

- `bucket_name`
- `website_endpoint`
- `cdn_resource_id`
- `cdn_provider_cname`

Не выводятся специально:

- secret part статического S3 key

Секрет остаётся в Terraform state, поэтому state нужно хранить в защищённом backend до продуктивного использования.

## GitHub Actions deploy

Workflow: `.github/workflows/deploy.yml`

Нужные GitHub Secrets:

- `YC_S3_ACCESS_KEY_ID`
- `YC_S3_SECRET_ACCESS_KEY`
- `YC_BUCKET_NAME`
- `YC_CDN_RESOURCE_ID`
- `YC_CLOUD_ID`
- `YC_FOLDER_ID`
- `YC_SERVICE_ACCOUNT_KEY`

Логика workflow:

1. `pnpm install`
2. `pnpm test`
3. `pnpm build`
4. `aws s3 sync` в Yandex Object Storage
5. отдельный `s3 cp` для `*.html` с `Cache-Control: no-cache, no-store, must-revalidate`
6. отдельный `s3 cp` для `assets/*` с `Cache-Control: public, max-age=31536000, immutable`
7. `yc cdn cache purge --resource-id ... --path '/*'`

### Проверка deploy

После публикации проверьте origin и домен:

```bash
curl -I http://xn--80abjdnrwhz3i.xn--p1ai.website.yandexcloud.net/
curl -I https://xn--80abjdnrwhz3i.xn--p1ai/
```

Для CSS или JS проверьте реальный файл из `frontend/dist/assets/`.

## Rollback

Если нужно быстро откатить сайт:

1. Возьмите предыдущий успешный commit.
2. Запустите workflow повторно для этого commit или временно сделайте `git revert`.
3. Дождитесь повторной загрузки `dist/` и purge CDN cache.

Terraform rollback для bucket/CDN лучше делать только через `terraform plan` и `terraform apply`, без ручного удаления ресурсов.
