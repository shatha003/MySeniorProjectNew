# SupplyNow - Required Diagrams for Report

## Chapter 3: Requirements and Analysis

### 3.9. Analysis Diagrams

#### 1. Use Case Diagram
- **Location**: Chapter 3, Section 3.9
- **Description**: Shows all actors (Retailer, Supplier, Admin) and their interactions with the system
- **Requirements**:
  - Include textual description for each use case
  - Show all major user interactions
  - Identify primary and secondary actors

**Actors to include**:
- Retailer
- Supplier
- Admin

**Use Cases** (with textual descriptions):
- User registration
- User login
- View products catalog
- Search products
- Place order
- Manage orders
- Track order status
- Manage inventory (Supplier)
- Manage products (Admin)
- Approve registrations (Admin)

#### 2. Activity Diagram(s)
- **Location**: Chapter 3, Section 3.9
- **Description**: Flow of activities for specific use cases
- **Requirements**: Specify clearly which use case each diagram represents

**Activity Diagrams needed**:

**Activity Diagram 1**: Retailer Order Placement
- Use case: Place order
- Show flow from browsing products to completing order

**Activity Diagram 2**: Supplier Inventory Management
- Use case: Manage inventory
- Show flow of adding/editing/removing products

**Activity Diagram 3**: Admin Registration Approval
- Use case: Approve registrations
- Show flow of reviewing and approving/rejecting user registrations

**Activity Diagram 4**: Order Processing
- Use case: Order status updates
- Show flow of order status changes (pending → confirmed → shipped → delivered)

#### 3. Entity-Relationship (ER) Diagram
- **Location**: Chapter 3, Section 3.9
- **Description**: Shows database structure and relationships
- **Requirements**: Show all entities, attributes, and relationships

**Entities**:
- Users (Retailer, Supplier, Admin)
- Products
- Orders
- Order Items
- Categories
- Inventory

**Relationships**:
- User (Retailer) places Order (1:N)
- Order contains Order Items (1:N)
- Order Item references Product (N:1)
- Supplier manages Products (1:N)
- Product belongs to Category (N:1)
- Admin approves User registration (N:1)

---

## Chapter 4: Design, Implementation and Testing

### 4.9. Design Diagrams

#### 4. Data Flow Diagram (DFD)
- **Location**: Chapter 4, Section 4.9
- **Description**: Shows how data flows through the system
- **Requirements**: Include at least DFD Level 0 (Context Diagram) and DFD Level 1

**DFD Level 0 (Context Diagram)**:
- Show system as a single process
- External entities: Retailer, Supplier, Admin, Firebase
- Show main data flows in/out

**DFD Level 1**:
- Show major processes:
  - User authentication
  - Product management
  - Order processing
  - Inventory management
  - Admin functions
- Show data stores (Firebase Database)
- Show data flows between processes and entities

#### 5. Component Diagram
- **Location**: Chapter 4, Section 4.9
- **Description**: Shows system architecture and component interactions
- **Requirements**: Show both mobile app and web dashboard components

**Components**:

**Mobile App (Flutter)**:
- UI Components (Screens, Widgets)
- State Management (Riverpod Providers)
- Services (AuthService, ProductService, OrderService)
- Firebase SDK integration
- Navigation (GoRouter)

**Web Dashboard (Next.js)**:
- UI Components (React Components)
- Context Providers (AuthContext)
- Services (API services)
- Firebase SDK integration
- Routing (Next.js App Router)

**Shared Components**:
- Firebase Authentication
- Firebase Realtime Database
- Firebase Storage

#### 6. System Architecture Diagram (Optional but recommended)
- **Location**: Chapter 4, Section 4.9
- **Description**: Shows overall system architecture
- **Layers to show**:
  - Presentation Layer (Mobile App, Web Dashboard)
  - Business Logic Layer (Services, State Management)
  - Data Layer (Firebase Services)
  - External Services (Firebase)

#### 7. Database Schema Diagram (Optional but recommended)
- **Location**: Chapter 4, Section 4.7 or 4.9
- **Description**: Detailed database structure
- **Requirements**: Show Firebase Realtime Database structure with paths

**Database Structure**:
- `users/`
  - `{uid}/`: User data
- `products/`
  - `{productId}/`: Product data
- `orders/`
  - `{orderId}/`: Order data
- `inventory/`
  - `{supplierId}/{productId}/`: Inventory data
- `categories/`: Product categories

---

## Summary

### Total Diagrams Required: 7+ diagrams

**Chapter 3 (Analysis)**:
1. Use Case Diagram with textual descriptions
2. Activity Diagram 1: Retailer Order Placement
3. Activity Diagram 2: Supplier Inventory Management
4. Activity Diagram 3: Admin Registration Approval
5. Activity Diagram 4: Order Processing
6. Entity-Relationship Diagram

**Chapter 4 (Design)**:
7. DFD Level 0 (Context Diagram)
8. DFD Level 1
9. Component Diagram
10. System Architecture Diagram (recommended)
11. Database Schema Diagram (recommended)

### Diagram Tools Recommended:
- **UML Diagrams (Use Case, Activity, Component)**: Lucidchart, Draw.io, Visio, StarUML
- **ER Diagram**: Lucidchart, Draw.io, MySQL Workbench
- **DFD**: Lucidchart, Draw.io
- **Architecture Diagram**: Lucidchart, Draw.io, Cloudcraft

### Tips for Drawing:
1. Maintain consistent styling across all diagrams
2. Use clear labels and legends
3. Include diagram numbers and titles
4. Add diagrams to the "List of Figures" in Front Matter
5. Refer to diagrams in the report text (e.g., "As shown in Figure 3.1...")
6. Ensure diagrams are legible when printed
7. Use color coding for different actor types or components
