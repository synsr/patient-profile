# Patient Profile Application

A Next.js application for displaying patient information, events, and medical notes.

## Assumptions

- Desktop-first design (primary users are doctors and front desk staff)
- Single page application with no navigation
- All data can be loaded upfront (no pagination)
- Mock data structure will be updated to reflect changes
- No authentication required
- API returns data in the correct order (e.g., clinical notes are returned newest first)
- No client-side sorting is needed as the API handles data ordering

## Key Architecture Decisions

### 1. Data Layer

- **React Query Integration**:
  - Automatic caching of API responses with unique query keys
  - Instant data access when switching between tabs (no refetch if data is cached)
  - Parallel data fetching with `Promise.all` for concurrent loading
- **Type-Safe API**: Comprehensive TypeScript types for all API responses and data structures

### 2. Component Architecture

- **Tab-Based Navigation**: Clear separation of concerns with dedicated tabs for different data types
- **Reusable Components**: Shared UI components (badges, cards, buttons) with consistent styling
- **Smart Data Processing**: Utility functions for data transformation (e.g., `extractKeyEvents` in TimelineTab)
- **Responsive Design**: Mobile-first approach with desktop-optimized layouts

### 3. UI/UX Approach

- **Information Hierarchy**:
  - Critical information (alerts, upcoming events) immediately visible
  - Recent events and notes easily scannable
  - Historical data accessible but not prominent
- **Visual Consistency**:
  - Consistent color scheme using CSS variables
  - Standardized spacing and typography
  - Clear visual indicators for status and importance
- **Interactive Elements**:
  - Expandable sections for detailed information
  - Quick actions for common tasks
  - Clear feedback for user actions

### 4. Performance Considerations

- **Hybrid Rendering Strategy**:
  - Server Components for static UI elements (headers, layouts, static content)
  - Client Components for interactive elements (data fetching, state management)
  - Benefits:
    - Reduced Time to Interactive (TTI) by minimizing client-side JavaScript
    - Improved First Contentful Paint (FCP) through server rendering
    - Optimized bundle size by splitting server and client code
- **Code Organization**: Clear separation of concerns between data, UI, and business logic

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query
- shadcn/ui (built on Radix UI)
- Lucide Icons
