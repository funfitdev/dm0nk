```
brew install golang-migrate
docker exec -t postgres-server pg_dump -s -U postgres -d dm0nk_dev > db/baseline_schema.sql


CURRENT_DATE=$(date +%Y_%m_%d_%H%M%S)
docker exec -t postgres-server pg_dump -s -U postgres -d dm0nk_dev > "db/schema_${CURRENT_DATE}.sql"
docker exec -t postgres-server pg_dump -s -U postgres -d dm0nk_dev > db/latest_schema.sql
migrate create -ext sql -dir db/migrations update_search_vector
migrate -path db/migrations -database $DATABASE_URL up
migrate -path db/migrations -database $DATABASE_URL version
migrate -path db/migrations -database $DATABASE_URL force 20250729042044
```
