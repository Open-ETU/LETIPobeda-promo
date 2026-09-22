# Эксплуатация сайта и новостей

## Публикация сайта

`frontend` собирается Vite и предварительно рендерит React в HTML. Браузер
гидратирует готовую страницу; текст и первые шесть реальных новостей доступны
без ожидания JavaScript. Шрифты Inter хранятся вместе с ассетами.

```bash
cd frontend
corepack pnpm install --frozen-lockfile
corepack pnpm lint
corepack pnpm test
corepack pnpm build
cd ..
python3 -m unittest discover -s scripts -v
python3 scripts/deploy-static.py --dist frontend/dist --bucket xn--80abjdnrwhz3i.xn--p1ai
```

Скрипт сначала загружает все ассеты и проверяет их успешную публикацию,
потом обновляет HTML, последним — `index.html`. Старые ассеты не удаляются:
открытые вкладки и откат продолжают работать. Каталоги `data/` и `.well-known/`
защищены от перезаписи фронтендом. Хешированные ассеты кешируются на год,
HTML требует проверки актуальности в браузере и кешируется на CDN на 60 секунд.

В GitHub Actions `ci.yml` проверяет код и сохраняет готовый `dist`. На `master`
он вызывает `deploy.yml`, публикующий именно этот артефакт. Настройки доступа:
`YC_SERVICE_ACCOUNT_KEY`, `YC_CLOUD_ID`, `YC_FOLDER_ID`, `YC_BUCKET_NAME`;
`YC_CDN_RESOURCE_ID` необязателен для очистки `/` и `/index.html`.
Остальные пути CDN очищать не нужно: имена ассетов меняются при изменении контента.

## Новости

- Функция `leti-pobeda-news`: `d4e35tg1kdcnsohqhev2`, Python 3.12, 128 МБ, 60 секунд.
- Таймер `leti-pobeda-news-refresh`: `a1smk9k3bf5hc748qiv7`, каждые 15 минут, одна повторная попытка через минуту.
- Аккаунт `aje1mkrf2rkr8novc5gs` имеет `storage.uploader` только на отдельный
  бакет `leti-pobeda-news` и право вызова только этой функции.
- Публичного вызова функции нет. Статические ключи не используются:
  временный IAM-токен выдаёт среда выполнения.
- JSON: https://storage.yandexcloud.net/leti-pobeda-news/data/news.json
- Бакет ограничен 10 МБ, публичны только чтение объектов и GET через CORS.
  Функция не имеет прав на бакет фронтенда. Политика и ACL основного бакета
  оставлены в исходном состоянии.

Сборщик проверяет RSS «ЛЭТИ Сегодня», при недоступности разбирает главную
страницу этого же издания. Принимаются только статьи с названием, корректной
датой и ссылкой источника. Публикуются до 12 заголовков и коротких аннотаций;
HTML источника не исполняется. При сбое или изменении разметки предыдущий JSON
сохраняется. `updatedAt` показывает время последнего успешного обновления.

Фронтенд показывает встроенный снимок сразу, затем делает один запрос JSON
с общим лимитом 4 секунды. Если запрос не удался, остаётся встроенный снимок
с сообщением о невозможности обновления. Ошибки сборщика видны в логах функции;
длительная недоступность источника требует проверки даты `updatedAt`.

Обновить сборщик:

```bash
python3 -m venv /tmp/leti-news-venv
/tmp/leti-news-venv/bin/pip install -r functions/news/requirements.txt
/tmp/leti-news-venv/bin/python -m unittest discover -s functions/news -v
python3 scripts/deploy-news.py
yc serverless function invoke --id d4e35tg1kdcnsohqhev2 --data '{}'
```

## CDN, DNS и TLS

CDN `bc8ry2x3jpo5z26nv6cf`, origin group `853973940564637083`.
Origin: `xn--80abjdnrwhz3i.xn--p1ai.website.yandexcloud.net`.
Провайдерский CNAME: `e1730e1788c00604.topology.gslb.yccdn.ru`.
Нельзя закреплять отдельный IP CDN в A-записи: адрес выбирает провайдер.

Перед сменой DNS нужно проверить сертификат и полную загрузку ресурсов
через CDN без отключения проверки TLS:

```bash
curl --fail --compressed --max-time 15 \
  --connect-to xn--80abjdnrwhz3i.xn--p1ai:443:e1730e1788c00604.topology.gslb.yccdn.ru:443 \
  https://xn--80abjdnrwhz3i.xn--p1ai/
```

Выпущен managed HTTP-сертификат основного домена `fpqa86k1mgjqc3tvq305`.
Выпущен и подключён managed DNS-сертификат apex + www `fpq84vjsbj3aabs537b7`.
Записи `_acme-challenge` и `_acme-challenge.www` в Cloudflare указывают
на `fpq84vjsbj3aabs537b7.cm.yandexcloud.net` в режиме DNS only для автоматического
продления. Перед переключением DNS нужно дождаться распространения сертификата
на узлы CDN и проверить оба имени с обычной TLS-валидацией.
Cloudflare Origin CA не подходит для прямых посетителей CDN.

## Откат

Предыдущий `index.html` сохранён как
`s3://xn--80abjdnrwhz3i.xn--p1ai/releases/2026-09-22-before/index.html`.
Старые ассеты сохранены. Для отката достаточно вернуть этот HTML и очистить
`/` и `/index.html` в CDN. Не запускать старый workflow с очисткой бакета.

До миграции apex был проксируемым CNAME на website endpoint, www —
проксируемым CNAME на apex. При откате маршрутизации использовать эти
значения только вместе с проверкой Cloudflare TLS и доступности сайта.
