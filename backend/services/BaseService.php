<?php
// The parent of every service (Reading 04): what all services share. A service
// gets its DAO through the constructor and adds the rules of its own entity.
// Services never contain SQL or HTTP code: they receive values, return values,
// and throw an exception when something is wrong.
class BaseService
{
    // The phone pattern of every form (register, profile, shelter):
    // 6 to 15 digits, one space allowed between them, + only at the start
    protected const PHONE_PATTERN = '/^\+?( ?[0-9]){6,15}$/';

    public function __construct(protected BaseDao $dao) {}

    public function getAll(): array
    {
        return $this->dao->getAll();
    }

    public function getById(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        return $this->dao->getById($id);
    }

    public function delete(int $id): bool
    {
        return $this->dao->delete($id);
    }

    // The two text checks every service needs, written once.
    // A required text field: trimmed, not empty and not longer than $max.
    protected function requiredText(array $data, string $field, int $max): string
    {
        $value = trim($data[$field] ?? '');
        if ($value === '') {
            throw new InvalidArgumentException("Field '$field' is required.");
        }
        if (mb_strlen($value) > $max) {
            throw new InvalidArgumentException("Field '$field' is too long (max $max characters).");
        }
        return $value;
    }

    // An optional text field: an empty value is stored as NULL.
    protected function optionalText(array $data, string $field, int $max): ?string
    {
        $value = trim($data[$field] ?? '');
        if ($value === '') {
            return null;
        }
        if (mb_strlen($value) > $max) {
            throw new InvalidArgumentException("Field '$field' is too long (max $max characters).");
        }
        return $value;
    }

    // One value from a fixed list (an ENUM column), e.g. 'dog' or 'cat'.
    protected function requiredChoice(array $data, string $field, array $allowed): string
    {
        $value = $data[$field] ?? '';
        if (!in_array($value, $allowed, true)) {
            throw new InvalidArgumentException("Field '$field' must be one of: " . implode(', ', $allowed) . '.');
        }
        return $value;
    }

    // A date in the format YYYY-MM-DD that really exists (no 2026-02-30).
    protected function requiredDate(array $data, string $field): string
    {
        $value = trim($data[$field] ?? '');
        $date = DateTime::createFromFormat('Y-m-d', $value);
        // format() gives the date back: if PHP had to correct it, it was invalid
        if ($date === false || $date->format('Y-m-d') !== $value) {
            throw new InvalidArgumentException("Field '$field' must be a date in the format YYYY-MM-DD.");
        }
        return $value;
    }

    // A date that has already happened, or today (a birth, a visit, a
    // vaccination). YYYY-MM-DD strings compare like dates.
    protected function requiredPastDate(array $data, string $field): string
    {
        $value = $this->requiredDate($data, $field);
        if ($value > date('Y-m-d')) {
            throw new InvalidArgumentException("Field '$field' can't be in the future.");
        }
        return $value;
    }

    // The id of another row (a foreign key), e.g. shelter_id: a whole number
    // from 1. Whether that row exists is checked by the service that uses it.
    protected function requiredId(array $data, string $field): int
    {
        $value = filter_var($data[$field] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if ($value === false) {
            throw new InvalidArgumentException("Field '$field' must be a whole number from 1.");
        }
        return $value;
    }
}
