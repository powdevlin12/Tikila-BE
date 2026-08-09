#!/bin/sh
set -e

# /app/uploads là bind mount (hoặc volume), quyền sở hữu lấy theo thư mục trên
# host chứ không theo image — nên `chown` trong Dockerfile bị đè lúc chạy.
# Sửa quyền ở đây rồi hạ xuống user `node`, app không chạy bằng root.
if [ "$(id -u)" = "0" ]; then
	mkdir -p /app/uploads/images/temp /app/uploads/videos/temp
	chown -R node:node /app/uploads
	exec su-exec node "$@"
fi

exec "$@"
