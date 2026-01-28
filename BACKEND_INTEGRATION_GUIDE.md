# Backend Integration Guide: Repository-Service Pattern

This guide outlines the standard architectural pattern for implementing backend features in `Pixel.Edu`. We strictly follow the **Controller -> Service -> Repository** flow to ensure separation of concerns, testability, and robustness.

## 1. Architecture Overview

### **A. Controller (`app/Http/Controllers`)**
- **Role:** Entry point for HTTP requests.
- **Responsibilities:**
  - Validate incoming requests (using FormRequests or inline validation).
  - Call the appropriate **Service** method.
  - Handle exceptions thrown by the Service (if not handled globally).
  - Return responses (Inertia views, JSON, Redirects).
- **Rules:**
  - NEVER call Models directly (except for simple reads if absolutely necessary, but prefer Repositories).
  - NEVER contain complex business logic.

### **B. Service (`app/Services`)**
- **Role:** Business Logic Layer.
- **Responsibilities:**
  - Perform validation logic (e.g., "Does this record already exist?", "Is this action allowed?").
  - Handle **Database Transactions** (`DB::beginTransaction`, `commit`, `rollBack`).
  - Coordinate multiple Repositories if needed.
  - Throw specific Exceptions on failure.
- **Rules:**
  - Should be framework-agnostic where possible.
  - Must ensure data integrity via transactions.

### **C. Repository (`app/Repositories`)**
- **Role:** Data Access Layer.
- **Responsibilities:**
  - Perform raw Database queries (Eloquent or Query Builder).
  - CRUD operations (Create, Read, Update, Delete).
- **Rules:**
  - Must implement a corresponding **Interface**.
  - No business logic allowed here.

### **D. Interface (`app/Interfaces`)**
- **Role:** Contract definition.
- **Responsibilities:**
  - Define the methods that a Repository must implement.
- **Rules:**
  - Allows for easy swapping of implementations (e.g., for testing).

---

## 2. Implementation Steps (Example: Create Tier)

### Step 1: Define Interface
Create `app/Interfaces/Tier/TierRepositoryInterface.php`:
```php
interface TierRepositoryInterface {
    public function create(array $data);
    public function findByName(string $name);
    public function getPaginated(int $perPage = 10);
}
```

### Step 2: Implement Repository
Create `app/Repositories/Tier/TierRepository.php`:
```php
class TierRepository implements TierRepositoryInterface {
    public function create(array $data) {
        return Tier::create($data);
    }
    
    public function getPaginated(int $perPage = 10) {
        return Tier::latest()->paginate($perPage);
    }
    // ...
}
```

### Step 3: Register in ServiceProvider
Bind the interface to the implementation in `app/Providers/RepositoryServiceProvider.php`.

### Step 4: Implement Service
Create `app/Services/Tier/TierService.php`:
```php
class TierService {
    public function createTier(array $data) {
        // ... transaction logic
    }
    
    public function getPaginatedTiers(int $perPage = 10) {
        return $this->tierRepository->getPaginated($perPage);
    }
}
```

### Step 5: Use in Controller
Inject `TierService` into `TierController` and use it.

---

## 3. Error Handling & Feedback

### Backend
- Return standard Inertia redirects with `with()` flash messages:
  - `success`: For successful actions.
  - `error`: For failures.

### Frontend (Pixel Art Sonner)
- We use a custom **Sonner** toaster to display these flash messages.
- **Design System:**
  - **Font:** `VT323`
  - **Borders:** `2px solid black`
  - **Shadows:** `4px 4px 0px 0px #000000`
  - **Colors:**
    - Success: Green bg / White text
    - Error: Red bg / White text
    - Warning: Yellow bg / Black text
