DEV := docker compose --env-file .env.dev -f docker-compose.dev.yml

.PHONY: up down logs ps deploy dev dev-down dev-logs

## ---------- PROD ----------
up:             ## Lên toàn bộ stack (build nếu chưa có image)
	docker compose up -d --build
	docker compose ps

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

## Build tuần tự + khởi động backend trước khi build frontend.
## Chậm hơn `make up` nhưng nhẹ RAM hơn và trang có nội dung ngay,
## không phải chờ ISR 60s. Dùng khi VPS 2GB không có swap dư dả.
deploy:
	docker compose build tikila-admin
	docker compose build tikila-be
	docker compose up -d mariadb tikila-be
	docker compose build fe-nextjs
	docker compose up -d
	docker compose ps
	docker image prune -f

## ---------- DEV ----------
dev:
	$(DEV) up -d --build
	$(DEV) ps

dev-down:
	$(DEV) down

dev-logs:
	$(DEV) logs -f
