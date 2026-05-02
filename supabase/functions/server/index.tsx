import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-d73ebad2/health", (c) => {
  return c.json({ status: "ok" });
});

// Admin signup
app.post("/make-server-d73ebad2/admin/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'admin' },
      email_confirm: true
    });

    if (error) {
      console.log(`Admin signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Admin signup exception: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Admin login (handled by Supabase client on frontend)
// Get all sea creatures
app.get("/make-server-d73ebad2/creatures", async (c) => {
  try {
    const creatures = await kv.getByPrefix("creature:");
    return c.json({ creatures });
  } catch (error) {
    console.log(`Get creatures error: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get single creature
app.get("/make-server-d73ebad2/creatures/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const creature = await kv.get(`creature:${id}`);

    if (!creature) {
      return c.json({ error: 'Creature not found' }, 404);
    }

    return c.json({ creature });
  } catch (error) {
    console.log(`Get creature error: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Create creature (protected)
app.post("/make-server-d73ebad2/creatures", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Auth error while creating creature: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, depth, description, imageUrl } = await c.req.json();
    const id = crypto.randomUUID();

    const creature = {
      id,
      name,
      depth: parseInt(depth),
      description,
      imageUrl,
      createdAt: new Date().toISOString()
    };

    await kv.set(`creature:${id}`, creature);

    return c.json({ success: true, creature });
  } catch (error) {
    console.log(`Create creature error: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Update creature (protected)
app.put("/make-server-d73ebad2/creatures/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Auth error while updating creature: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const { name, depth, description, imageUrl } = await c.req.json();

    const existing = await kv.get(`creature:${id}`);
    if (!existing) {
      return c.json({ error: 'Creature not found' }, 404);
    }

    const creature = {
      ...existing,
      name,
      depth: parseInt(depth),
      description,
      imageUrl,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`creature:${id}`, creature);

    return c.json({ success: true, creature });
  } catch (error) {
    console.log(`Update creature error: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Delete creature (protected)
app.delete("/make-server-d73ebad2/creatures/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Auth error while deleting creature: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    await kv.del(`creature:${id}`);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete creature error: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);