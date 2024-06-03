ARG PYTHON_VERSION=3.12
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS web-builder

WORKDIR /frontend

COPY ./frontend/package.json ./
RUN npm install --no-audit --no-fund --no-package-lock

ARG MAPBOX_TOKEN
ARG MAPBOX_STYLES

ENV PUBLIC_MAPBOX_TOKEN=$MAPBOX_TOKEN
ENV PUBLIC_MAPBOX_STYLES=$MAPBOX_STYLES

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
    python -m pip install -r requirements.txt --disable-pip-version-check --no-warn-script-location && \
    python -m pip install waitress --disable-pip-version-check --no-warn-script-location

USER appuser

COPY ./backend ./

COPY --from=web-builder /frontend/dist ./dist

ENV FLASK_APP=main.py
ENV FLASK_ENV=production

ARG BUILD_DATE
ARG VCS_REF
ARG VCS_URL
ARG VERSION

LABEL org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.authors="Julien W <cefadrom1@gmail.com>" \
      org.opencontainers.image.source=$VCS_URL \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.revision=$VCS_REF \
      org.opencontainers.image.title="Deliver'it" \
      org.opencontainers.image.description="A web application to help you manage your VRP deliveries and routes in France." \
      org.opencontainers.image.base.name="python" \
      org.opencontainers.image.base.version="${PYTHON_VERSION}-slim"

EXPOSE 8080

CMD ["waitress-serve", "--call", "app:create_app"]
