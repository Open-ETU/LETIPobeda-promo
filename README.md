# LETIPobeda-promo

Промо-сайт для абитуриентов СПбГЭТУ «ЛЭТИ».

- `frontend/`: React/Vite, предварительный рендер HTML при сборке, локальные шрифты.
- `functions/news/`: сбор новостей по расписанию в Yandex Cloud Functions.
- `scripts/deploy-static.py`: публикация ассетов перед HTML без удаления предыдущей версии.
- `infra/terraform/`: CDN, сервисные аккаунты и опциональный DNS; существующий бакет фронтенда управляется отдельно.

Команды сборки, описание инфраструктуры, публикация и откат — в [руководстве эксплуатации](docs/operations.md).
Замеры исходной реализации — в [аудите производительности](docs/audits/2026-09-22-performance.md).

Для локальной разработки:

```bash
cd frontend
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Для инфраструктуры скопируйте `infra/terraform/terraform.tfvars.example` в
`terraform.tfvars`, укажите существующие cloud/folder и ID публичного сертификата,
затем выполните `terraform init` и `terraform plan`. Не применяйте план создания
дубликатов уже существующих ресурсов: сначала проверьте используемый state.
Authoritative DNS остаётся в Cloudflare; apex поддерживает CNAME flattening.
