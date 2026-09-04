import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import dns from 'dns';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { BlogPost } from '../models/BlogPost';
import { Inquiry } from '../models/Inquiry';

dotenv.config();

// Ensure reliable DNS resolution for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Fallback to system default DNS if setServers is restricted
}

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/orbitly_studio';
    console.log(`[Seed] Connecting to database: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await BlogPost.deleteMany({});
    await Inquiry.deleteMany({});

    console.log('[Seed] Creating default admin user...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('OrbitlyAdmin2025!', salt);

    const adminUser = await User.create({
      name: 'Orbitly Studio Admin',
      email: 'admin@orbitly.studio',
      passwordHash,
      role: 'admin',
    });
    console.log(`[Seed] Created admin: ${adminUser.email} (Password: OrbitlyAdmin2025!)`);

    console.log('[Seed] Seeding sample studio projects...');
    const projects = [
      {
        title: 'Apex Health — Next-Gen Telemedicine & Remote Patient Monitoring',
        slug: 'apex-health-telemedicine-platform',
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        shortDescription: 'Comprehensive patient portal and doctor consultation suite engineered for frictionless virtual care.',
        description: `Apex Health approached Orbitly Studio to reimagine their patient care ecosystem from ground zero. We architected a complete mobile application, physician management console, and HIPAA-compliant video consultation pipeline that dramatically simplified remote triage.

Our team spearheaded the end-to-end design sprints, created a modular medical design system, and delivered high-performance web and mobile clients that reduced patient appointment booking friction by over 62%.`,
        tags: ['Product Strategy', 'UI/UX Design', 'Mobile App', 'Web Development'],
        client: 'Apex Health Technologies',
        year: '2025',
        deliverables: ['Product Strategy', 'Design System', 'iOS & Android App', 'Web Admin Console'],
        challenge: 'Legacy EHR interfaces caused severe doctor burnout and high patient abandonment rates during virtual onboarding.',
        solution: 'Built an intuitive 2-click booking pipeline with integrated encrypted video streaming, biometric authentication, and automated vital sign tracking.',
        results: 'Achieved 4.9-star App Store rating, 62% reduction in onboarding drop-offs, and over 150,000 completed virtual consultations in the first 90 days.',
        isPublished: true,
      },
      {
        title: 'NovaPay — Global Cross-Border FinTech Neo-Banking Suite',
        slug: 'novapay-global-fintech-banking',
        thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        shortDescription: 'Multi-currency digital wallet and automated corporate treasury management platform.',
        description: `NovaPay required a brand identity and digital product that felt as trustworthy as an established tier-1 bank while retaining the speed and agility of modern decentralized finance.

Orbitly Studio delivered a complete brand refresh, interactive web application, and treasury dashboard that visualizes millions of dollars in real-time FX transactions with micro-second accuracy.`,
        tags: ['Brand Identity', 'UI/UX Design', 'FinTech', 'Web Development'],
        client: 'NovaPay Global Inc.',
        year: '2025',
        deliverables: ['Brand Guidelines', 'Web Application', 'Corporate Dashboard', 'Marketing Website'],
        challenge: 'Complex currency hedging and foreign exchange workflows were overwhelming non-technical finance teams.',
        solution: 'Developed a human-first FX conversion interface with real-time charting, customizable threshold alerts, and instant multi-currency settlement.',
        results: 'Processed over $450M in annualized transactions within 6 months post-launch and secured Series B funding of $35M.',
        isPublished: true,
      },
      {
        title: 'Luminary AI — Enterprise Generative Intelligence Workspace',
        slug: 'luminary-ai-enterprise-workspace',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        shortDescription: 'Autonomous agentic workflow builder and knowledge retrieval interface for Fortune 500 enterprises.',
        description: `Luminary AI needed an enterprise-grade interface allowing knowledge workers to orchestrate multi-agent workflows, ingest private document vaults, and inspect LLM reasoning traces.

We crafted a bespoke node-based canvas system, contextual prompt inspector, and dark-mode workspace built for multi-hour productivity and zero visual fatigue.`,
        tags: ['UI/UX Design', 'AI/ML', 'Design Systems', 'Web Development'],
        client: 'Luminary Systems',
        year: '2025',
        deliverables: ['Visual Canvas UX', 'Design System', 'Interactive Prototypes', 'Frontend Architecture'],
        challenge: 'Existing AI interfaces were limited to basic chat inputs and could not visualize complex agent reasoning trees.',
        solution: 'Created an infinite node canvas with branching timeline exploration, real-time citation inspectors, and collaborative document editing.',
        results: 'Adopted by 40+ enterprise teams within 4 months, accelerating document review times by 4.2x.',
        isPublished: true,
      },
      {
        title: 'Veloce Motors — Real-Time 3D Hypercar Digital Studio',
        slug: 'veloce-motors-digital-configurator',
        thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        shortDescription: 'Photorealistic WebGL vehicle configurator and bespoke digital showroom experience.',
        description: `Veloce Motors contracted Orbitly Studio to create a bespoke web showroom allowing luxury vehicle collectors to customize bespoke aerodynamic kits, interior leather textures, and track telemetry packages.

We blended cutting-edge 3D graphics rendering with minimalist typography to present an unrivaled luxury purchasing journey.`,
        tags: ['3D Web Experience', 'Brand Identity', 'Frontend Engineering', 'Luxury'],
        client: 'Veloce Automotive Group',
        year: '2024',
        deliverables: ['3D Configurator UX', 'Web Showcase', 'Brand Assets', 'Asset Pipeline'],
        challenge: 'High-fidelity 3D assets previously caused long loading times and sluggish 15 FPS frame rates on standard mobile browsers.',
        solution: 'Engineered optimized geometry compression and progressive material streaming delivering 60 FPS across all modern mobile and desktop browsers.',
        results: 'Generated over $18M in pre-order reservations within the first 48 hours of live release.',
        isPublished: true,
      },
      {
        title: 'Synthetix Cloud — Developer Observability & Mesh Console',
        slug: 'synthetix-cloud-observability-console',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        shortDescription: 'High-density metrics visualizer and service mesh topology analyzer for Kubernetes clusters.',
        description: `Synthetix required a command-center interface capable of streaming live telemetry from thousands of distributed microservices without stutter or UI sluggishness.

Orbitly Studio designed and engineered a keyboard-driven observability dashboard with lightning-fast search filters, flame graphs, and live anomaly alarms.`,
        tags: ['Developer Tools', 'UI/UX Design', 'Web Development', 'High Density UI'],
        client: 'Synthetix Cloud Labs',
        year: '2024',
        deliverables: ['Product Architecture', 'Component Library', 'Interactive Topology Graph'],
        challenge: 'Displaying 100,000+ metrics nodes simultaneously caused browser DOM throttling and memory leaks.',
        solution: 'Implemented virtualized canvas rendering with Web Workers for asynchronous metric parsing.',
        results: 'Reduced Mean Time to Resolution (MTTR) by 54% for DevOps engineers managing multi-region deployments.',
        isPublished: true,
      },
      {
        title: 'PulseCommerce — Modular Headless Retail Engine (Internal Draft)',
        slug: 'pulsecommerce-headless-retail',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        shortDescription: 'Experimental headless commerce toolkit currently in closed alpha development.',
        description: `This is an internal prototype project testing headless checkout pipelines and automated inventory sync. It is saved as an unpublished draft to verify that draft case studies remain hidden from public visitors.`,
        tags: ['E-Commerce', 'Draft', 'Internal'],
        client: 'Orbitly Labs',
        year: '2025',
        deliverables: ['API Specs', 'Wireframes'],
        challenge: 'Testing draft privacy protection in API endpoints.',
        solution: 'Demonstrates backend role-based publication validation.',
        results: 'Confirms drafts are only visible to authenticated admins.',
        isPublished: false, // Set to false to verify draft filtering!
      },
    ];

    await Project.insertMany(projects);
    console.log(`[Seed] Seeded ${projects.length} studio projects.`);

    console.log('[Seed] Seeding sample blog posts...');
    const blogPosts = [
      {
        title: 'How We Built a Real-Time Design System for Fast-Moving Startups',
        slug: 'building-realtime-design-system-for-startups',
        thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'A deep dive into how tokenization, atomic design, and automated component syncing eliminate design debt before it starts.',
        content: `## The Hidden Cost of Design Debt

When startups scale rapidly from Seed to Series A, product teams often prioritize shipping features over architectural consistency. Before long, buttons have 14 shades of blue, typography varies across routes, and engineers spend half their sprint recreating components that already exist.

At Orbitly Studio, we implement a **token-first design pipeline** that acts as the single source of truth across Figma and production code.

### 1. Semantic Design Tokens Over Hardcoded Hex Values
Instead of referencing raw hex codes like \`#3B82F6\`, our design systems utilize semantic design tokens:
- \`color.surface.primary\`
- \`color.action.interactive\`
- \`spacing.layout.gutter\`

When branding updates occur or dark mode is introduced, adjusting the token dictionary updates the entire platform instantly.

\`\`\`typescript
// Example: Token Structure
export const tokens = {
  colors: {
    brand: {
      primary: '#0F172A',
      accent: '#6366F1',
    },
    surface: {
      default: '#FFFFFF',
      subtle: '#F8FAFC',
    }
  }
};
\`\`\`

### 2. Automated Syncing Between Figma & GitHub
Using GitHub Actions and Figma Tokens APIs, any token update published by our designers automatically generates a pull request with updated CSS variables and TypeScript typings.

### Key Takeaways
1. **Invest early**: A 2-week investment in design tokens saves months of refactoring later.
2. **Constrain options**: Fewer spacing and color variations lead to faster decisions and cleaner UIs.
3. **Automate handoff**: Never manually copy CSS variables between design files and codebase.`,
        author: 'Sarah Chen, Head of Design',
        readTime: '5 min read',
        tags: ['Design Systems', 'UI/UX', 'Engineering'],
        featured: true,
        isPublished: true,
      },
      {
        title: 'The Art of Micro-Interactions: Elevating Good Products to Great',
        slug: 'art-of-micro-interactions-in-modern-web',
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'Why subtle animations, haptic cues, and reactive feedback loops create emotional resonance with your users.',
        content: `## Why Micro-Interactions Matter

Great design isn't just how a product looks—it is how the product feels in motion. Micro-interactions are subtle visual or physical feedback loops that acknowledge user intent, communicate system status, and infuse joy into repetitive workflows.

### The Anatomy of a Micro-Interaction
Every meaningful micro-interaction consists of four essential components:

1. **Trigger**: An action initiated by the user (e.g., hovering, clicking, pulling to refresh) or system state.
2. **Rules**: The programmatic conditions governing what happens when triggered.
3. **Feedback**: The sensory confirmation (subtle scale transition, spring animation, color shift).
4. **Loops & Modes**: How the state persists over time.

### Practical Principles for Modern Interfaces
- **Keep durations under 250ms**: Animations exceeding 300ms feel sluggish to power users.
- **Use spring physics over linear easings**: Cubic beziers and spring physics mirror physical world inertia.
- **Provide immediate optimistic feedback**: Don't make the user wait for server roundtrips before updating the UI state.`,
        author: 'Marcus Vance, Lead Frontend Architect',
        readTime: '4 min read',
        tags: ['Frontend', 'Animation', 'UI/UX'],
        featured: true,
        isPublished: true,
      },
      {
        title: 'Zero-Latency Architecture: Building Resilient APIs with Express & TypeScript',
        slug: 'zero-latency-architecture-express-typescript',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'How to structure Node.js backend services with strict validation, rate limiting, and lean database indexing for peak throughput.',
        content: `## Crafting Scalable Node.js Microservices

When engineering APIs for modern startups, latency and predictability are paramount. In this article, we outline our battle-tested backend architecture using Express, TypeScript, and MongoDB.

### 1. Enforcing Type Safety from Request to Database
By combining **Zod** schema validation with TypeScript interfaces, our controllers are guaranteed that only sanitized, compliant data enters business logic:

\`\`\`typescript
// Validation at the gateway
export const createProjectSchema = z.object({
  title: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  isPublished: z.boolean().default(false),
});
\`\`\`

### 2. Multi-Layered Security Strategy
- **JWT Verification**: Strict verification of tokens and immediate role inspection.
- **Granular Rate Limiting**: Dedicated rate windows for authentication vs general read APIs.
- **Compound Database Indexing**: Ensuring high-frequency queries like \`{ isPublished: 1, createdAt: -1 }\` execute in single-digit milliseconds.`,
        author: 'David Kim, VP of Engineering',
        readTime: '6 min read',
        tags: ['Backend', 'Node.js', 'Security', 'TypeScript'],
        featured: false,
        isPublished: true,
      },
      {
        title: 'Why Early-Stage Startups Must Clarify Value Proposition Before Writing Code',
        slug: 'clarifying-value-proposition-before-code',
        thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'The most expensive code is the code you should have never written. Learn how product discovery sprints de-risk roadmap investments.',
        content: `## The Myth of Moving Fast by Skipping Strategy

Founders often rush into development believing that raw speed of feature shipping is their biggest competitive advantage. However, building the wrong feature quickly is just a fast route to high burn rates and customer confusion.

### The Orbitly Discovery Framework
Before writing a single line of frontend code, we run a focused 2-week discovery sprint:

1. **Customer Problem Validation**: Interviewing 15+ potential users to identify urgent pain points.
2. **Competitive Moat Definition**: Determining what unique capability makes your product 10x better than incumbents.
3. **Interactive Low-Fidelity Prototyping**: Testing user flows with clickable wireframes to validate mental models.

### Results
Founders who complete our discovery sprints ship 40% fewer throwaway features and achieve product-market fit significantly faster.`,
        author: 'Elena Rostova, Product Strategy Partner',
        readTime: '5 min read',
        tags: ['Product Strategy', 'Startups', 'Discovery'],
        featured: false,
        isPublished: true,
      },
      {
        title: 'Optimizing Web Vitals for Modern Next.js Applications',
        slug: 'optimizing-web-vitals-nextjs-apps',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'Practical techniques for achieving 99+ Lighthouse performance scores with Next.js App Router, image optimization, and font preloading.',
        content: `## Performance is a Core Feature

Search engines and users alike reward lightning-fast page transitions. With Next.js 14 and modern web standards, achieving sub-second Largest Contentful Paint (LCP) and zero Cumulative Layout Shift (CLS) is entirely within reach.

### Core Techniques We Implement
1. **Next.js Image Component**: Serving modern WebP and AVIF formats with automatic responsive sizing.
2. **Selective Hydration & Server Components**: Keeping heavy JavaScript libraries off the client bundle.
3. **Font Pre-loading**: Using next/font to eliminate Flash of Unstyled Text (FOUT).`,
        author: 'Marcus Vance, Lead Frontend Architect',
        readTime: '4 min read',
        tags: ['Next.js', 'Performance', 'Web Vitals'],
        featured: false,
        isPublished: true,
      },
      {
        title: 'Draft Article: Internal Studio Trends 2026 (Unpublished Test)',
        slug: 'draft-internal-trends-2026',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'Internal editorial notes for team review only. Not for public distribution.',
        content: `## Confidential Internal Notes

This draft post verifies that unpublished articles are strictly excluded from public API responses and only visible to authorized administrators logged into the Orbitly Studio Dashboard.`,
        author: 'Orbitly Studio Editorial',
        readTime: '2 min read',
        tags: ['Internal', 'Draft'],
        featured: false,
        isPublished: false, // Set to false to verify draft filtering!
      },
    ];

    await BlogPost.insertMany(blogPosts);
    console.log(`[Seed] Seeded ${blogPosts.length} blog posts.`);

    console.log('[Seed] Seeding sample client inquiries/leads...');
    const inquiries = [
      {
        name: 'Alexander Wright',
        email: 'alexander@zenithpay.io',
        service: 'Full-Stack Development',
        budget: '₹5,00,000 – ₹10,00,000',
        message: 'We are looking to rebuild our payment orchestration portal with Next.js and high-frequency WebSockets. Need a 6-week discovery and sprint delivery.',
        status: 'new',
      },
      {
        name: 'Sophia Sterling',
        email: 'sophia@veloxbiotech.com',
        service: 'UI/UX Design',
        budget: '₹2,50,000 – ₹5,00,000',
        message: 'Looking for a comprehensive design system and mobile app UI for our genomics data viewer platform.',
        status: 'contacted',
      },
    ];

    await Inquiry.insertMany(inquiries);
    console.log(`[Seed] Seeded ${inquiries.length} sample client inquiries.`);

    console.log('==============================================');
    console.log('🎉 Database seeding completed successfully!');
    console.log('Admin Email: admin@orbitly.studio');
    console.log('Admin Password: OrbitlyAdmin2025!');
    console.log('==============================================');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Seeding failed with error:', error);
    process.exit(1);
  }
};

seedDatabase();
