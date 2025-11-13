# Development Workflow Guide

## Git Workflow

### Branch Strategy

We use a modified Git Flow workflow optimized for the portal development:

```bash
# Main branches
main                    # Production-ready code
develop                 # Integration branch for features
staging                 # Pre-production testing

# Feature branches
feature/dashboard-ui    # New feature development
feature/auth-system     # Authentication improvements
bugfix/login-issue      # Bug fixes
hotfix/security-patch   # Critical production fixes
```

### Branch Naming Conventions

```bash
feature/<feature-name>        # New features
bugfix/<bug-description>      # Bug fixes
hotfix/<urgent-fix>          # Critical fixes
refactor/<component-name>     # Code refactoring
docs/<documentation-update>   # Documentation updates
```

### Commit Message Format

```bash
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no functional changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(dashboard): add project overview widget
fix(auth): resolve JWT token expiration issue
docs(api): update authentication endpoints
refactor(components): extract reusable button component
```

## Development Process

### 1. Setting Up for Development

```bash
# Clone your fork
git clone https://github.com/your-username/fataplus-portal.git
cd fataplus-portal

# Add upstream remote
git remote add upstream https://github.com/fataplus/portal.git

# Create feature branch
git checkout -b feature/your-feature-name

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Daily Development Workflow

```bash
# Sync with main branch
git fetch upstream
git rebase upstream/develop

# Work on your feature
# Make changes, commit regularly

# Push to your fork
git push origin feature/your-feature-name

# Create pull request when ready
```

### 3. Code Review Process

#### Before Creating Pull Request

- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] API routes include error handling
- [ ] Database queries are optimized
- [ ] Security best practices are followed
- [ ] Tests are written for new functionality
- [ ] Documentation is updated

#### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests written
- [ ] Integration tests passed
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No merge conflicts
```

## Coding Standards

### TypeScript Guidelines

#### Type Definitions

```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Use types for unions or computed types
type UserRole = 'client' | 'project-manager' | 'admin';
type ProjectStatus = 'intake' | 'planning' | 'in-progress' | 'completed';

// Generic types for reusable components
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

#### Component Props

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size = 'md',
  disabled = false,
  onClick,
  className = '',
}) => {
  // Component implementation
};
```

### React Best Practices

#### Component Structure

```typescript
// Server Component for data fetching
async function ProjectDashboard({ projectId }: { projectId: string }) {
  const project = await getProject(projectId);
  const documents = await getProjectDocuments(projectId);

  return <ProjectDashboardClient project={project} documents={documents} />;
}

// Client Component for interactivity
'use client';

function ProjectDashboardClient({
  project,
  documents
}: {
  project: Project;
  documents: Document[];
}) {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="project-dashboard">
      {/* Dashboard UI */}
    </div>
  );
}
```

#### Custom Hooks

```typescript
// Custom hook for API calls
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [url]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchData };
}
```

### API Development Standards

#### API Route Structure

```typescript
// src/app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/payload/init-payload';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayloadClient();
    const project = await payload.findByID({
      collection: 'projects',
      id: params.id,
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const payload = await getPayloadClient();

    const project = await payload.update({
      collection: 'projects',
      id: params.id,
      data: body,
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Error Handling

```typescript
// Centralized error handler
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Usage in API routes
export async function handler(request: NextRequest) {
  try {
    // API logic here
    const result = await someOperation();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    console.error('Unhandled error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Testing Strategy

### Unit Testing

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant styles', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('bg-blue-600');
  });
});
```

### Integration Testing

```typescript
// __tests__/api/projects.test.ts
import { GET } from '@/app/api/projects/[id]/route';
import { NextRequest } from 'next/server';

// Mock Payload CMS
jest.mock('@/payload/init-payload');

describe('Projects API', () => {
  it('returns project data for valid ID', async () => {
    const mockProject = {
      id: '1',
      projectName: 'Test Project',
      status: 'in-progress',
    };

    const mockPayload = {
      findByID: jest.fn().mockResolvedValue(mockProject),
    };
    require('@/payload/init-payload').getPayloadClient.mockResolvedValue(mockPayload);

    const request = new NextRequest('http://localhost:3000/api/projects/1');
    const response = await GET(request, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockProject);
  });
});
```

### E2E Testing

```typescript
// e2e/client-journey.spec.ts
import { test, expect } from '@playwright/test';

test('client login and view projects', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');

  // Fill login form
  await page.fill('[data-testid="email-input"]', 'client@example.com');
  await page.fill('[data-testid="password-input"]', 'password123');
  await page.click('[data-testid="login-button"]');

  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard');

  // Check for project list
  await expect(page.locator('[data-testid="project-list"]')).toBeVisible();

  // Click on first project
  await page.click('[data-testid="project-item"]:first-child');

  // Verify project details
  await expect(page.locator('[data-testid="project-details"]')).toBeVisible();
});
```

## Performance Guidelines

### Code Splitting

```typescript
// Lazy loading components
const DocumentViewer = dynamic(() => import('@/components/DocumentViewer'), {
  loading: () => <div>Loading viewer...</div>,
  ssr: false,
});

const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  loading: () => <div>Loading admin panel...</div>,
});
```

### Image Optimization

```typescript
import Image from 'next/image';

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card">
      <Image
        src={project.thumbnail}
        alt={project.name}
        width={300}
        height={200}
        className="rounded-lg"
        priority={false}
      />
      <h3>{project.name}</h3>
    </div>
  );
}
```

### Database Optimization

```typescript
// Efficient database queries
async function getProjectWithDocuments(projectId: string) {
  const payload = await getPayloadClient();

  // Use populate for related data
  const project = await payload.findByID({
    collection: 'projects',
    id: projectId,
    depth: 2, // Populate relationships
  });

  return project;
}
```

## Security Best Practices

### Input Validation

```typescript
// Zod schema validation
import { z } from 'zod';

const CreateProjectSchema = z.object({
  projectName: z.string().min(1).max(255),
  description: z.string().max(1000),
  clientEmail: z.string().email(),
  expectedDelivery: z.string().optional(),
});

// Usage in API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateProjectSchema.parse(body);

    // Process validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
  }
}
```

### Authentication Middleware

```typescript
// Middleware for protected routes
export async function withAuth(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>,
  requiredRoles: UserRole[] = []
) {
  return async (req: NextRequest, context: any) => {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const user = await verifyToken(token);

      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      return handler(req, { ...context, user });
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
}
```

## Development Tools

### VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-jest"
  ]
}
```

### Package Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:generate": "payload generate:types",
    "db:push": "payload push",
    "db:migrate": "payload migrate"
  }
}
```

### Pre-commit Hooks

```bash
#!/bin/sh
# .husky/pre-commit

npm run lint
npm run type-check
npm run test
```

This development workflow ensures code quality, consistency, and maintainability throughout the portal development process.

---