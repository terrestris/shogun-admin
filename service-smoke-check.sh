#!/bin/bash
set -e

curl -fsS http://localhost:8080/ && echo "Frontend OK"
curl -fsS http://localhost:8080/health && echo "API OK"
curl -fsS http://localhost:8080/health/db && echo "DB OK"
curl -fsS http://localhost:8080/auth/realms/master && echo "Keycloak OK"
curl -fsS http://localhost:8080/geoserver/web && echo "Geoserver OK"
