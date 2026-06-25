# Preorder-Manager

A modern web application for managing product preorders with filtering, sorting, pagination, and CRUD operations.

## Overview

Preorder-Manager is a full-stack Next.js application that helps businesses manage their preorder systems. It allows users to create, view, edit, and delete preorders with features like status filtering, sorting, and pagination to handle large datasets efficiently.

## Features

- **Preorder Management**: Create, view, edit, and delete preorders
- **Status Filtering**: Filter preorders by active/inactive status
- **Sorting**: Sort preorders by name, created date, start date, or end date
- **Pagination**: View preorders in paginated lists (10 per page)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **SQLite Database**: Lightweight database solution with Prisma ORM
- **Form Validation**: Client-side validation for form inputs

## Tech Stack

- **Framework**: Next.js 16.2.9 (React 19.2.4)
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **ESLint**: Code quality and linting
- **TypeScript**: Type safety throughout



## Installation

### Prerequisites

- Node.js 20+
- npm or yarn

### Setup Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Preorder-Manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env file
   echo "DATABASE_URL=\"file:./dev.db\"" > .env
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Seed initial data (optional):
   ```bash
   npx prisma/seed.ts
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Development

### Scripts

The project includes several npm scripts for common tasks:

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database with initial data

### Database Management

- **Migrations**: Use `npx prisma migrate dev` to create and apply new migrations
- **Schema**: View and modify the database schema in `prisma/schema.prisma`
- **Seed Data**: Initial seed data is in `prisma/seed.ts`

### Project Structure

```
├── app/
│   ├── page.tsx                    # Home page (preorders list)
│   ├── preorders/
│   │   ├── new/page.tsx            # Create new preorder
│   │   └── [id]/edit/page.tsx      # Edit existing preorder
│   └── api/                        # API routes
│       ├── preorders/
│       │   ├── route.ts             # GET, POST
│       │   └── [id]/
│       │       ├── route.ts         # GET, PATCH, DELETE
│       │       └── status/route.ts  # PATCH (toggle status)
├── components/                     # UI components
│   ├── PreorderForm.tsx            # Form for creating/editing preorders
│   ├── PreorderTable.tsx           # Table displaying preorders
│   ├── FilterTabs.tsx              # Status filtering component
│   ├── SortPopover.tsx             # Sorting component
│   ├── Pagination.tsx              # Pagination component
│   └── StatusToggle.tsx            # Individual status toggle
├── lib/                            # Application libraries
│   └── prisma.ts                   # Prisma client configuration
├── prisma/                         # Prisma configuration
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # Seed data script
├── public/                         # Static assets
├── package.json                    # Project dependencies
├── postcss.config.mjs              # PostCSS configuration
└── tsconfig.json                   # TypeScript configuration
```

## API Endpoints

### Preorders

- **GET** `/api/preorders` - Get paginated list of preorders with filtering and sorting
  - Query params: `page`, `pageSize`, `status`, `sortBy`, `order`

- **POST** `/api/preorders` - Create a new preorder
  - Body: `name`, `products`, `preorderWhen`, `startsAt`, `endsAt`, `isActive`

### Individual Preorder

- **GET** `/api/preorders/:id` - Get a specific preorder
- **PATCH** `/api/preorders/:id` - Update a preorder
- **DELETE** `/api/preorders/:id` - Delete a preorder
- **PATCH** `/api/preorders/:id/status` - Toggle preorder active status

## Form Fields

The preorder form includes the following fields:

- **Name** (required): The name of the preorder
- **Products** (optional, default: 1): Number of products in the preorder
- **Preorder When** (optional, default: "regardless-of-stock"): When to go on preorder
- **Starts At** (required): When the preorder starts
- **Ends At** (optional): When the preorder ends
- **Is Active** (optional, default: true): Whether the preorder is active

## Deployment

### Building for Production

```bash
npm run build
```

### Starting Production

```bash
npm start
```

For other hosting platforms like Vercel, Netlify, or similar, check their documentation for deployment.

## Contributing

### Code Quality

1. Follow TypeScript typing conventions
2. Use ESLint for code quality checks
3. Write clean, readable code with minimal comments
4. Ensure all changes are tested

### Best Practices

- Use functional components with hooks
- Prefer client components over server components when appropriate
- Implement proper error handling and validation
- Follow accessibility best practices
- Write descriptive commit messages

## Testing

Currently, the project doesn't include specific test files, but the application is structured with proper error handling and validation in the API routes.

## Performance Considerations

- Implemented server-side rendering for the home page
- Used Suspense boundaries for loading states
- Optimized database queries with proper filtering
- Implemented pagination to handle large datasets efficiently

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or feature requests, please check the project repository for available support channels.

---

*Built with Next.js, React, and Prisma for a modern web application experience.*
