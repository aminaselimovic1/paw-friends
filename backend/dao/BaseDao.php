<?php
require_once __DIR__ . '/Database.php';

// The parent of every DAO: the queries that every table needs. A DAO passes
// its table name to this constructor and adds only its own queries.
class BaseDao
{
    protected PDO $connection;

    public function __construct(protected string $table)
    {
        $this->connection = Database::getConnection();
    }

    public function getAll(): array
    {
        $stmt = $this->connection->prepare("SELECT * FROM {$this->table}");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getById(int $id): ?array
    {
        $stmt = $this->connection->prepare(
            "SELECT * FROM {$this->table} WHERE id = :id"
        );
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    // insert() and update() take the column names from the keys of $data, so
    // the service must pass only keys it chose itself, never a request's keys.
    public function insert(array $data): array
    {
        $columns = implode(', ', array_keys($data));
        $params = ':' . implode(', :', array_keys($data));
        $stmt = $this->connection->prepare(
            "INSERT INTO {$this->table} ($columns) VALUES ($params)"
        );
        $stmt->execute($data);
        $data['id'] = (int) $this->connection->lastInsertId();
        return $data;
    }

    public function update(int $id, array $data): bool
    {
        unset($data['id']);
        $fields = [];
        foreach (array_keys($data) as $column) {
            $fields[] = "$column = :$column";
        }
        $stmt = $this->connection->prepare(
            "UPDATE {$this->table} SET " . implode(', ', $fields)
            . " WHERE id = :id"
        );
        $data['id'] = $id;
        $stmt->execute($data);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $id): bool
    {
        $stmt = $this->connection->prepare(
            "DELETE FROM {$this->table} WHERE id = :id"
        );
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }
}
