# Demo Sample Test Case

## Repository Used for Demo

**Repository**: `facebook/react` (or any React repository)
**Files**: `src/React.js`, `packages/react/src/ReactElement.js`

## Generated Test Case Sample

### Test Case: Unit Tests for ReactElement.js

- **Framework**: Jest
- **Type**: Unit Test
- **Priority**: High
- **Description**: Test React element creation and validation functions

### Generated Test Code:

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReactElement from "./ReactElement";

describe("ReactElement", () => {
  test("renders without crashing", () => {
    render(<ReactElement />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  test("handles user interactions correctly", () => {
    render(<ReactElement />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    // Add your assertions here
  });

  test("displays correct content", () => {
    const props = { title: "Test Title" };
    render(<ReactElement {...props} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  test("handles edge cases", () => {
    render(<ReactElement title="" />);
    // Test with empty or null props
  });
});
```

### Dependencies:

- `@testing-library/react`
- `@testing-library/jest-dom`
- `jest`

### Setup Instructions:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

## Demo Flow for Screen Recording

### 1. Connect Repository (30 seconds)

- Enter `facebook/react` or your own repository
- Optional: Add GitHub token for rate limits
- Click "Connect Repository"

### 2. Browse & Select Files (45 seconds)

- Show file browser interface
- Filter by "Testable Only"
- Search for specific files
- Select 2-3 React component files
- Choose testing framework (Jest)
- Click "Analyze Files"

### 3. Review Generated Test Cases (60 seconds)

- Show different test types (Unit, Integration, E2E)
- Expand test case details
- Show file associations and descriptions
- Demonstrate priority levels and frameworks

### 4. Generate Test Code (45 seconds)

- Click "Generate Code" on a test case
- Show generated test code with syntax highlighting
- Demonstrate tabs (Code, Dependencies, Setup)
- Show copy/download functionality

### 5. Create Pull Request (30 seconds) - BONUS

- Click "Create PR" (if token provided)
- Show PR creation success
- Open GitHub to show actual PR

**Total Demo Time**: ~3-4 minutes

## Key Points to Highlight

### Technical Features:

- ✅ Real GitHub API integration
- ✅ Multiple testing frameworks supported
- ✅ AI-powered test case generation
- ✅ Professional UI/UX with progress tracking
- ✅ TypeScript throughout (frontend + backend)
- ✅ Responsive design

### UI/UX Features:

- Clean, modern interface
- Step-by-step guided workflow
- Real-time progress indicators
- Professional color scheme
- Intuitive file browser
- Code syntax highlighting
- Comprehensive error handling

### Bonus Features:

- ✅ PR creation with GitHub API
- ✅ Token-based authentication
- ✅ Multiple programming languages
- ✅ Framework detection and suggestions
