import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as exerciseService from "./exerciseService.tsx";

const app = new Hono();

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

// Environment variable validation
const validateEnvironment = () => {
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
  const missing = requiredVars.filter(key => !Deno.env.get(key));
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    return false;
  }
  return true;
};

// Health check endpoint with environment validation
app.get("/health", (c) => {
  const envValid = validateEnvironment();
  return c.json({ 
    status: envValid ? "ok" : "error", 
    timestamp: new Date().toISOString(),
    environment: envValid ? "configured" : "missing_variables"
  });
});

// Main endpoint
app.get("/make-server-896b3bbe/health", (c) => {
  const envValid = validateEnvironment();
  return c.json({ 
    status: envValid ? "ok" : "error", 
    service: "FitTracker", 
    timestamp: new Date().toISOString(),
    environment: envValid ? "configured" : "missing_variables"
  });
});

// KV Store endpoints with better error handling
app.get("/api/kv/:key", async (c) => {
  try {
    if (!validateEnvironment()) {
      return c.json({ error: "Service misconfigured" }, 503);
    }
    
    const key = c.req.param("key");
    const value = await kv.get(key);
    return c.json({ key, value });
  } catch (error) {
    console.error("KV GET error:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/api/kv/:key", async (c) => {
  try {
    if (!validateEnvironment()) {
      return c.json({ error: "Service misconfigured" }, 503);
    }
    
    const key = c.req.param("key");
    const body = await c.req.json();
    await kv.set(key, body.value);
    return c.json({ success: true, key });
  } catch (error) {
    console.error("KV POST error:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/api/kv/:key", async (c) => {
  try {
    if (!validateEnvironment()) {
      return c.json({ error: "Service misconfigured" }, 503);
    }
    
    const key = c.req.param("key");
    await kv.del(key);
    return c.json({ success: true, key });
  } catch (error) {
    console.error("KV DELETE error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Exercise tracking endpoints with enhanced error handling
app.post("/make-server-896b3bbe/exercises/session", async (c) => {
  try {
    if (!validateEnvironment()) {
      return c.json({ error: "Service misconfigured" }, 503);
    }
    
    const body = await c.req.json();
    const { userId, ...sessionData } = body;
    
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }
    
    // Validate session data
    if (!sessionData.exerciseId || sessionData.weight === undefined || 
        sessionData.reps === undefined || sessionData.sets === undefined) {
      return c.json({ error: "Missing required session data" }, 400);
    }
    
    const result = await exerciseService.saveExerciseSession(userId, sessionData);
    
    if (result.success) {
      return c.json(result);
    } else {
      return c.json({ error: result.error }, 500);
    }
  } catch (error) {
    console.error("Error saving exercise session:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-896b3bbe/exercises/stats/:userId", async (c) => {
  try {
    if (!validateEnvironment()) {
      return c.json({ error: "Service misconfigured" }, 503);
    }
    
    const userId = c.req.param("userId");
    const exerciseId = c.req.query("exerciseId");
    
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }
    
    const result = await exerciseService.getUserExerciseStats(userId, exerciseId);
    
    if (result.success) {
      return c.json(result);
    } else {
      return c.json({ error: result.error }, 500);
    }
  } catch (error) {
    console.error("Error getting exercise stats:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-896b3bbe/exercises/history/:userId", async (c) => {
  try {
    if (!validateEnvironment()) {
      return c.json({ error: "Service misconfigured" }, 503);
    }
    
    const userId = c.req.param("userId");
    const exerciseId = c.req.query("exerciseId");
    const limit = parseInt(c.req.query("limit") || "50");
    
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }
    
    if (limit < 1 || limit > 1000) {
      return c.json({ error: "Limit must be between 1 and 1000" }, 400);
    }
    
    const result = await exerciseService.getUserExerciseHistory(userId, exerciseId, limit);
    
    if (result.success) {
      return c.json(result);
    } else {
      return c.json({ error: result.error }, 500);
    }
  } catch (error) {
    console.error("Error getting exercise history:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-896b3bbe/exercises/records/:userId", async (c) => {
  try {
    if (!validateEnvironment()) {
      return c.json({ error: "Service misconfigured" }, 503);
    }
    
    const userId = c.req.param("userId");
    
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }
    
    const result = await exerciseService.getPersonalRecords(userId);
    
    if (result.success) {
      return c.json(result);
    } else {
      return c.json({ error: result.error }, 500);
    }
  } catch (error) {
    console.error("Error getting personal records:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-896b3bbe/exercises/analytics/:userId", async (c) => {
  try {
    if (!validateEnvironment()) {
      return c.json({ error: "Service misconfigured" }, 503);
    }
    
    const userId = c.req.param("userId");
    const timeframe = c.req.query("timeframe") || "30";
    
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }
    
    const timeframeNum = parseInt(timeframe);
    if (isNaN(timeframeNum) || timeframeNum < 1 || timeframeNum > 365) {
      return c.json({ error: "Timeframe must be between 1 and 365 days" }, 400);
    }
    
    const result = await exerciseService.getWorkoutAnalytics(userId, timeframe);
    
    if (result.success) {
      return c.json(result);
    } else {
      return c.json({ error: result.error }, 500);
    }
  } catch (error) {
    console.error("Error getting workout analytics:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/make-server-896b3bbe/exercises/session/:userId/:sessionId", async (c) => {
  try {
    if (!validateEnvironment()) {
      return c.json({ error: "Service misconfigured" }, 503);
    }
    
    const userId = c.req.param("userId");
    const sessionId = c.req.param("sessionId");
    
    if (!userId || !sessionId) {
      return c.json({ error: "User ID and Session ID are required" }, 400);
    }
    
    const result = await exerciseService.deleteExerciseSession(userId, sessionId);
    
    if (result.success) {
      return c.json(result);
    } else {
      return c.json({ error: result.error }, 500);
    }
  } catch (error) {
    console.error("Error deleting exercise session:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Custom exercise endpoints
app.post("/make-server-896b3bbe/exercises/custom", async (c) => {
  try {
    if (!validateEnvironment()) {
      return c.json({ error: "Service misconfigured" }, 503);
    }
    
    const body = await c.req.json();
    const { userId, ...exerciseData } = body;
    
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }
    
    if (!exerciseData.name || !exerciseData.category) {
      return c.json({ error: "Exercise name and category are required" }, 400);
    }
    
    const result = await exerciseService.saveCustomExercise(userId, exerciseData);
    
    if (result.success) {
      return c.json(result);
    } else {
      return c.json({ error: result.error }, 500);
    }
  } catch (error) {
    console.error("Error saving custom exercise:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-896b3bbe/exercises/custom/:userId", async (c) => {
  try {
    if (!validateEnvironment()) {
      return c.json({ error: "Service misconfigured" }, 503);
    }
    
    const userId = c.req.param("userId");
    
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }
    
    const result = await exerciseService.getUserCustomExercises(userId);
    
    if (result.success) {
      return c.json(result);
    } else {
      return c.json({ error: result.error }, 500);
    }
  } catch (error) {
    console.error("Error getting custom exercises:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Enhanced error handling
app.onError((err, c) => {
  console.error(`Global error handler: ${err.message}`);
  console.error(err.stack);
  
  // Don't expose internal error details in production
  const isProduction = Deno.env.get("DENO_ENV") === "production";
  
  if (isProduction) {
    return c.json({ error: "Internal Server Error" }, 500);
  } else {
    return c.json({ 
      error: "Internal Server Error", 
      details: err.message,
      stack: err.stack 
    }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ 
    error: "Not Found", 
    path: c.req.path,
    method: c.req.method 
  }, 404);
});

// Graceful shutdown handling
const shutdown = () => {
  console.log("Shutting down server gracefully...");
  Deno.exit(0);
};

// Only add signal listeners in Deno environment
if (typeof Deno !== 'undefined' && Deno.addSignalListener) {
  Deno.addSignalListener("SIGTERM", shutdown);
  Deno.addSignalListener("SIGINT", shutdown);
}

console.log("FitTracker server starting...");
console.log("Environment validation:", validateEnvironment() ? "PASS" : "FAIL");

// Export the app for edge functions
export default app;

// Start server if running directly
if (import.meta.main) {
  Deno.serve(app.fetch);
}