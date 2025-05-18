# Patient Profile Application

A Next.js application for displaying patient information, events, and medical notes.

## Assumptions

- Desktop-first design (primary users are doctors and front desk staff)
- Single page application with no navigation
- All data can be loaded upfront (no pagination)
- Mock data structure will be updated to reflect changes
- No authentication required

## Design Decisions

### Information Architecture

- **Critical Information First**: Patient's current status, active alerts, and upcoming events are immediately visible
- **Hierarchical Layout**:
  - Top: Patient identity, current status, and active alerts
  - Middle: Recent events and notes (last 7 days)
  - Bottom: Historical data and detailed records
- **Data Prioritization**:
  - Active alerts and critical information are highlighted
  - Recent events and notes are easily scannable
  - Historical data is accessible but not prominent

### UI/UX Approach

- **Desktop-Optimized Layout**:
  - Multi-column design for efficient space utilization
  - Sidebar for quick navigation between sections
  - Fixed header with critical patient information
- **Visual Hierarchy**:
  - Clear typography scale for different information levels
  - Color coding for alerts and status indicators
  - Consistent spacing and alignment
- **Interactive Elements**:
  - Expandable sections for detailed information
  - Quick filters for events and notes
  - Hover states for additional context

## Architecture & Design Decisions

### 1. Data Layer

- **Single Data Fetching Hook**: Using a single `usePatientData` hook instead of multiple hooks to:
  - Prevent race conditions
  - Ensure data consistency
  - Reduce network requests
  - Simplify state management
- **Mock API Structure**:
  - Organized under `src/lib/api/mock/` to clearly separate mock data from real API implementations
  - Simulated network delays for realistic testing
  - Type-safe API responses

### 2. Component Architecture

- **Server vs Client Components**:
  - Only `PatientProfile` is a client component (uses React Query)
  - Other components (`PatientHeader`, `EventsList`, `NotesList`, `PatientSkeleton`) are server components
  - Benefits:
    - Better performance through server-side rendering
    - Reduced client-side JavaScript
    - Clear separation of concerns

### 3. UI/UX Considerations

- **Loading States**:
  - Skeleton loading for initial data fetch
  - Smooth transitions between states
- **Error Handling**:
  - Graceful error states
  - User-friendly error messages
- **Responsive Design**:
  - Mobile-first approach
  - Grid layout for larger screens
  - Consistent spacing and typography

### 4. Performance Optimizations

- **Data Fetching**:
  - Parallel data fetching with `Promise.all`
  - React Query for efficient caching
  - No unnecessary re-renders
- **Component Structure**:
  - Minimal client-side JavaScript
  - Server-side rendering where possible
  - Efficient prop drilling

### 5. Type Safety

- Comprehensive TypeScript types for:
  - API responses
  - Component props
  - Event handlers
- Strict type checking for better development experience

## Project Structure

```
src/
├── app/
│   └── patients/
│       └── [id]/
│           └── page.tsx
├── components/
│   ├── PatientProfile.tsx
│   ├── PatientHeader.tsx
│   ├── EventsList.tsx
│   ├── NotesList.tsx
│   └── PatientSkeleton.tsx
└── lib/
    ├── api/
    │   ├── mock/
    │   │   ├── patient.json
    │   │   ├── events.json
    │   │   └── doctors_notes.json
    │   └── mockData.ts
    └── types/
        └── index.ts
```

## Future Improvements

1. **Data Layer**:

   - Add proper error boundaries
   - Implement retry logic for failed requests
   - Add data validation

2. **UI/UX**:

   - Add notes creation functionality
   - Implement search and filtering
   - Add pagination for events and notes

3. **Performance**:

   - Implement proper caching strategies
   - Add performance monitoring
   - Optimize bundle size

4. **Testing**:
   - Add unit tests
   - Add integration tests
   - Add E2E tests

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
- React Query
- TanStack Query
