const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TrimFlow Barbershop API',
      version: '1.0.0',
      description: `
## TrimFlow — Professional Barbershop Management Platform

Full REST API for managing barbershops, bookings, services, finance, and AI-powered chat assistant.

### Authentication
Most endpoints require a JWT Bearer token. Get one via \`/api/auth/register\` or \`/api/auth/login\`.

### Roles
- **client** — Can book appointments, chat with AI, manage own profile
- **barber** — Can manage services, view bookings, track finance
- **admin** — Full access to all endpoints
      `,
      contact: {
        name: 'TrimFlow Team',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token (from login/register response)',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            role: { type: 'string', enum: ['client', 'barber', 'admin'], example: 'client' },
            avatar: { type: 'string', example: 'https://example.com/avatar.jpg' },
            styleCoins: { type: 'number', example: 50 },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              },
            },
          },
        },
        Barber: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { $ref: '#/components/schemas/User' },
            bio: { type: 'string', example: 'Professional barber with 5 years experience' },
            rating: { type: 'number', example: 4.5 },
            isVerified: { type: 'boolean', example: true },
            workingHours: {
              type: 'object',
              properties: {
                start: { type: 'string', example: '09:00' },
                end: { type: 'string', example: '18:00' },
              },
            },
            portfolio: { type: 'array', items: { type: 'string' } },
          },
        },
        Service: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            barberId: { type: 'string' },
            name: { type: 'string', example: 'Classic Haircut' },
            price: { type: 'number', example: 50000 },
            duration: { type: 'number', example: 30, description: 'Duration in minutes' },
            description: { type: 'string', example: "Classic men's haircut" },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            clientId: { $ref: '#/components/schemas/User' },
            barberId: { $ref: '#/components/schemas/Barber' },
            serviceId: { $ref: '#/components/schemas/Service' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
              example: 'pending',
            },
            styleCoinEarned: { type: 'number', example: 10 },
          },
        },
        Expense: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            barberId: { type: 'string' },
            description: { type: 'string', example: 'Scissors and tools' },
            amount: { type: 'number', example: 150000 },
            date: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Auth', description: 'Authentication & registration' },
      { name: 'Users', description: 'User profile management' },
      { name: 'Barbers', description: 'Barber profiles' },
      { name: 'Services', description: 'Barber services' },
      { name: 'Bookings', description: 'Appointment bookings' },
      { name: 'Finance', description: 'Revenue & expense tracking' },
      { name: 'Admin', description: 'Admin dashboard & management' },
      { name: 'Chat', description: 'AI assistant chat' },
      { name: 'Stream', description: 'Real-time SSE streams' },
    ],
    paths: {
      // ─── Health ───
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          security: [],
          responses: {
            200: {
              description: 'Server is running',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'OK' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // ─── Auth ───
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register new user',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', minLength: 2, maxLength: 50, example: 'John Doe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', minLength: 6, example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Registration successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Validation error or user already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login with email and password',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Account blocked', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/auth/google': {
        get: {
          tags: ['Auth'],
          summary: 'Initiate Google OAuth',
          security: [],
          description: 'Redirects to Google login page. Open in browser.',
          responses: {
            302: { description: 'Redirect to Google OAuth' },
          },
        },
      },
      // ─── Users ───
      '/api/users/me': {
        get: {
          tags: ['Users'],
          summary: 'Get my profile',
          responses: {
            200: { description: 'User profile', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/User' } } } } } },
            401: { description: 'Unauthorized' },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete my account',
          description: '⚠️ Permanently deletes the account. Irreversible.',
          responses: {
            200: { description: 'Account deleted' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/users/profile': {
        put: {
          tags: ['Users'],
          summary: 'Update my profile',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', minLength: 2, maxLength: 50, example: 'Updated Name' },
                    avatar: { type: 'string', format: 'uri', example: 'https://example.com/avatar.jpg' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Profile updated' },
            400: { description: 'Validation error' },
          },
        },
      },
      // ─── Barbers ───
      '/api/barbers': {
        get: {
          tags: ['Barbers'],
          summary: 'Get all barbers',
          security: [],
          responses: {
            200: { description: 'List of barbers', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/Barber' } } } } } } },
          },
        },
        post: {
          tags: ['Barbers'],
          summary: 'Create barber (Admin only)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['userId'],
                  properties: {
                    userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    bio: { type: 'string', maxLength: 500 },
                    workingHours: {
                      type: 'object',
                      properties: {
                        start: { type: 'string', pattern: '^\\d{2}:\\d{2}$', example: '09:00' },
                        end: { type: 'string', pattern: '^\\d{2}:\\d{2}$', example: '18:00' },
                      },
                    },
                    portfolio: { type: 'array', items: { type: 'string', format: 'uri' } },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Barber created' },
            400: { description: 'Validation error' },
            404: { description: 'User not found' },
          },
        },
      },
      '/api/barbers/{id}': {
        get: {
          tags: ['Barbers'],
          summary: 'Get barber by ID',
          security: [],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Barber details' },
            404: { description: 'Barber not found' },
          },
        },
        delete: {
          tags: ['Barbers'],
          summary: 'Delete barber (Admin only)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Barber deleted' },
            404: { description: 'Barber not found' },
          },
        },
      },
      '/api/barbers/me': {
        put: {
          tags: ['Barbers'],
          summary: 'Update my barber profile',
          description: 'For barber or admin role',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    bio: { type: 'string', maxLength: 500 },
                    workingHours: {
                      type: 'object',
                      properties: {
                        start: { type: 'string', example: '10:00' },
                        end: { type: 'string', example: '20:00' },
                      },
                    },
                    portfolio: { type: 'array', items: { type: 'string', format: 'uri' } },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Profile updated' },
            404: { description: 'Barber profile not found' },
          },
        },
      },
      // ─── Services ───
      '/api/services/{barberId}': {
        get: {
          tags: ['Services'],
          summary: 'Get services by barber',
          security: [],
          parameters: [{ name: 'barberId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'List of services', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/Service' } } } } } } },
          },
        },
      },
      '/api/services': {
        post: {
          tags: ['Services'],
          summary: 'Create service',
          description: 'Barber or Admin',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['barberId', 'name', 'price', 'duration'],
                  properties: {
                    barberId: { type: 'string' },
                    name: { type: 'string', example: 'Classic Haircut' },
                    price: { type: 'number', example: 50000 },
                    duration: { type: 'number', example: 30, description: 'Minutes' },
                    description: { type: 'string', example: "Classic men's haircut" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Service created' },
            400: { description: 'Validation error' },
            403: { description: 'Not authorized' },
          },
        },
      },
      '/api/services/{id}': {
        put: {
          tags: ['Services'],
          summary: 'Update service',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    price: { type: 'number' },
                    duration: { type: 'number' },
                    description: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Service updated' },
            404: { description: 'Service not found' },
          },
        },
        delete: {
          tags: ['Services'],
          summary: 'Delete service',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Service deleted' },
            404: { description: 'Service not found' },
          },
        },
      },
      // ─── Bookings ───
      '/api/bookings': {
        get: {
          tags: ['Bookings'],
          summary: 'Get all bookings (Admin only)',
          responses: {
            200: { description: 'All bookings', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/Booking' } } } } } } },
          },
        },
        post: {
          tags: ['Bookings'],
          summary: 'Create booking',
          description: 'Client or Admin. Validates working hours, overlap, and barber verification.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['barberId', 'serviceId', 'startTime'],
                  properties: {
                    barberId: { type: 'string' },
                    serviceId: { type: 'string' },
                    startTime: { type: 'string', format: 'date-time', example: '2026-05-02T10:00:00.000Z' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Booking created' },
            400: { description: 'Validation error' },
            404: { description: 'Barber or service not found' },
            409: { description: 'Time slot already booked' },
          },
        },
      },
      '/api/bookings/my': {
        get: {
          tags: ['Bookings'],
          summary: 'Get my bookings',
          description: 'Client: own bookings. Barber: bookings for their profile. Admin: all.',
          responses: {
            200: { description: 'User bookings' },
          },
        },
      },
      '/api/bookings/{id}': {
        patch: {
          tags: ['Bookings'],
          summary: 'Update booking status',
          description: 'Client can cancel. Barber can transition. Admin can set any status.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Status updated' },
            400: { description: 'Invalid transition' },
            404: { description: 'Booking not found' },
          },
        },
        delete: {
          tags: ['Bookings'],
          summary: 'Delete booking (Admin only)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Booking deleted' },
            403: { description: 'Not authorized' },
          },
        },
      },
      // ─── Finance ───
      '/api/finance/stats': {
        get: {
          tags: ['Finance'],
          summary: 'Get finance statistics',
          description: 'Barber sees own stats, Admin sees all.',
          responses: {
            200: {
              description: 'Finance stats',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          todayRevenue: { type: 'number' },
                          weeklyRevenue: { type: 'number' },
                          totalRevenue: { type: 'number' },
                          totalClients: { type: 'number' },
                          todayBookings: { type: 'number' },
                          completedBookings: { type: 'number' },
                          expenses: { type: 'array', items: { $ref: '#/components/schemas/Expense' } },
                          totalExpenses: { type: 'number' },
                          netProfit: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/finance/expense': {
        post: {
          tags: ['Finance'],
          summary: 'Create expense',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['description', 'amount'],
                  properties: {
                    description: { type: 'string', example: 'Scissors and tools' },
                    amount: { type: 'number', example: 150000 },
                    date: { type: 'string', format: 'date-time' },
                    barberId: { type: 'string', description: 'Required for admin' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Expense created' },
            400: { description: 'Validation error' },
          },
        },
      },
      '/api/finance/expense/{id}': {
        put: {
          tags: ['Finance'],
          summary: 'Update expense',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    description: { type: 'string' },
                    amount: { type: 'number' },
                    date: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Expense updated' },
            404: { description: 'Expense not found' },
          },
        },
        delete: {
          tags: ['Finance'],
          summary: 'Delete expense',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Expense deleted' },
            404: { description: 'Expense not found' },
          },
        },
      },
      // ─── Admin ───
      '/api/admin/dashboard': {
        get: {
          tags: ['Admin'],
          summary: 'Get admin dashboard',
          responses: {
            200: {
              description: 'Dashboard data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          totalUsers: { type: 'number' },
                          totalBarbers: { type: 'number' },
                          totalBookings: { type: 'number' },
                          todayBookings: { type: 'number' },
                          bookingStats: {
                            type: 'object',
                            properties: {
                              pending: { type: 'number' },
                              confirmed: { type: 'number' },
                              completed: { type: 'number' },
                              cancelled: { type: 'number' },
                            },
                          },
                          recentBookings: { type: 'array', items: { $ref: '#/components/schemas/Booking' } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/admin/users': {
        get: {
          tags: ['Admin'],
          summary: 'Get all users',
          parameters: [
            { name: 'role', in: 'query', schema: { type: 'string', enum: ['admin', 'barber', 'client'] }, description: 'Filter by role' },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          ],
          responses: {
            200: { description: 'Users list with pagination' },
          },
        },
      },
      '/api/admin/users/{id}': {
        put: {
          tags: ['Admin'],
          summary: 'Update user',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    role: { type: 'string', enum: ['admin', 'barber', 'client'] },
                    isBlocked: { type: 'boolean' },
                    styleCoins: { type: 'number' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'User updated' },
            404: { description: 'User not found' },
          },
        },
      },
      '/api/admin/verify/{barberId}': {
        post: {
          tags: ['Admin'],
          summary: 'Verify barber',
          parameters: [{ name: 'barberId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Barber verified' },
            404: { description: 'Barber not found' },
          },
        },
      },
      // ─── Chat ───
      '/api/chat': {
        post: {
          tags: ['Chat'],
          summary: 'Send message to AI assistant',
          description: 'Chat with TrimFlow AI. The AI can recommend barbers, propose bookings, and answer questions in Uzbek.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: { type: 'string', minLength: 1, maxLength: 2000, example: 'Qaysi sartaroshlar bor?' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'AI response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          message: { type: 'object', description: 'ChatMessage document' },
                          createdBookings: { type: 'array', items: {} },
                          proposedBookings: { type: 'array', items: {} },
                          recommendations: { type: 'array', items: { type: 'string' } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // ─── Stream ───
      '/api/stream/queue': {
        get: {
          tags: ['Stream'],
          summary: 'Queue SSE stream',
          description: 'Server-Sent Events endpoint for real-time queue updates. Connection stays open.',
          responses: {
            200: {
              description: 'SSE stream',
              content: { 'text/event-stream': { schema: { type: 'string' } } },
            },
          },
        },
      },
    },
  },
  apis: [], // We define everything inline above
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { font-size: 2rem; }
      `,
      customSiteTitle: 'TrimFlow API Docs',
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );

  // JSON endpoint for the spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;
