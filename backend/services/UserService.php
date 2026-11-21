<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/UserDao.php';
require_once __DIR__ . '/../dao/AdoptionApplicationDao.php';
require_once __DIR__ . '/../dao/VetRecordDao.php';
require_once __DIR__ . '/../dao/VaccinationDao.php';

// The rules for user accounts. The checks match the register, profile and
// manage-users forms. The password is stored only as a hash, and the hash
// never leaves this service: every method that returns a user removes it.
class UserService extends BaseService
{
    private const ROLES = ['user', 'vet', 'admin'];

    // The admin's form sends name, email and role; the profile form sends
    // name, email, phone and city. If a request doesn't send one of these
    // fields, update() keeps the stored value (same idea as pets' photo_url).
    private const KEPT_IF_NOT_SENT = ['role', 'phone', 'city'];

    // $this->userDao and BaseService's $this->dao are the same object.
    // The typed name tells PHP and the editor that it has getByEmail().
    public function __construct(
        private UserDao $userDao = new UserDao(),
        private AdoptionApplicationDao $applicationDao = new AdoptionApplicationDao(),
        private VetRecordDao $vetRecordDao = new VetRecordDao(),
        private VaccinationDao $vaccinationDao = new VaccinationDao(),
    ) {
        parent::__construct($userDao);
    }

    public function getAll(): array
    {
        return array_map(fn ($user) => $this->withoutPassword($user), parent::getAll());
    }

    public function getById(int $id): ?array
    {
        $user = parent::getById($id);
        return $user === null ? null : $this->withoutPassword($user);
    }

    public function create(array $data): array
    {
        $user = $this->validate($data);
        $password = $this->validatePassword($data);
        $this->checkEmailIsFree($user['email'], null);

        // password_hash() makes a bcrypt hash with a random salt; the password
        // itself is never stored. Login (M4) checks it with password_verify().
        $user['password_hash'] = password_hash($password, PASSWORD_DEFAULT);
        $created = $this->dao->insert($user);
        return $this->getById($created['id']); // without password_hash
    }

    // PUT changes the account's data, never the password: changing a password
    // needs the current one (the profile form asks for it), so it comes with
    // login in M4. "password" in the body is ignored (not in the allow-list).
    // Returns null if the user doesn't exist (the route answers 404).
    public function update(int $id, array $data): ?array
    {
        $current = $this->getById($id);
        if ($current === null) {
            return null;
        }
        $user = $this->validate($data);
        foreach (self::KEPT_IF_NOT_SENT as $field) {
            if (!array_key_exists($field, $data)) {
                $user[$field] = $current[$field];
            }
        }
        $this->checkEmailIsFree($user['email'], $id);
        $this->dao->update($id, $user);
        return $this->getById($id);
    }

    // A user that other rows point to can't be deleted: their applications,
    // the applications they reviewed (admins) and the health records they
    // wrote (vets) would lose their owner. The database refuses it too.
    public function delete(int $id): bool
    {
        $user = $this->getById($id);
        if ($user === null) {
            return false;
        }
        $historyCount = count($this->applicationDao->getByUserId($id))
            + count($this->applicationDao->getByReviewerId($id))
            + count($this->vetRecordDao->getByVetId($id))
            + count($this->vaccinationDao->getByVetId($id));
        if ($historyCount > 0) {
            throw new DomainException(
                "{$user['name']} can't be deleted: $historyCount application(s) or health record(s) "
                . 'belong to this account and would lose their owner.'
            );
        }
        return $this->dao->delete($id);
    }

    // users.email is UNIQUE: no two accounts may share an email, because
    // login finds the account by its email. A clash is a broken rule (409).
    // The column's collation ignores upper/lower case, so getByEmail() finds
    // "Lejla@Example.com" for "lejla@example.com" too.
    private function checkEmailIsFree(string $email, ?int $ownId): void
    {
        $other = $this->userDao->getByEmail($email);
        if ($other !== null && $other['id'] !== $ownId) {
            throw new DomainException('This email is already used by another account.');
        }
    }

    private function withoutPassword(array $user): array
    {
        unset($user['password_hash']);
        return $user;
    }

    // The same rule as register: at least 8 characters, not only spaces.
    // Not trimmed: spaces are allowed inside and around a password.
    private function validatePassword(array $data): string
    {
        $password = $data['password'] ?? '';
        if (!is_string($password) || trim($password) === '') {
            throw new InvalidArgumentException("Field 'password' is required.");
        }
        if (mb_strlen($password) < 8) {
            throw new InvalidArgumentException("Field 'password' must have at least 8 characters.");
        }
        return $password;
    }

    // Checks the input and builds a new array with only the allowed fields.
    // password_hash is not one of them: only create() sets it, from the password.
    private function validate(array $data): array
    {
        $name = $this->requiredText($data, 'name', 100);
        if (mb_strlen($name) < 2) {
            throw new InvalidArgumentException("Field 'name' must have at least 2 characters.");
        }

        $email = $this->requiredText($data, 'email', 255);
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            throw new InvalidArgumentException("Field 'email' must be a valid email address.");
        }

        // A new account is a 'user' unless a role is sent (the column's default)
        $role = array_key_exists('role', $data) ? $this->requiredChoice($data, 'role', self::ROLES) : 'user';

        $phone = $this->optionalText($data, 'phone', 50);
        if ($phone !== null && !preg_match(self::PHONE_PATTERN, $phone)) {
            throw new InvalidArgumentException("Field 'phone' must have 6 to 15 digits, with + only at the start.");
        }

        return [
            'name' => $name,
            'email' => $email,
            'role' => $role,
            'phone' => $phone,
            'city' => $this->optionalText($data, 'city', 100),
        ];
    }
}
