ARG PYTHON_VERSION=3.12
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS web-builder

WORKDIR /frontend

COPY ./frontend/package.json ./
RUN npm install --no-audit --no-fund --no-package-lock

COPY ./frontend ./
RUN npm run build


FROM python:${PYTHON_VERSION}-slim as release

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=backend/requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt --disable-pip-version-check --no-warn-script-location

USER appuser

COPY ./backend ./

COPY --from=web-builder /frontend/dist ./dist

ENV FLASK_APP=main.py
ENV FLASK_ENV=production

EXPOSE 5000

CMD ["python", "main.py"]
