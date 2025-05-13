import redis from "@/lib/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ✅ Enable CORS
    await NextCors(req, res, {
      methods: ["GET", "POST", "PUT", "DELETE"],
      origin: "*",
      optionsSuccessStatus: 200,
    });

    const method = req.method;

    switch (method) {
      case "GET": {
        const columns = await redis.get("columns");
        // Ensure it's an array
        const result = Array.isArray(columns) ? columns : [];
        return res.status(200).json(result);
      }

      case "POST": {
        const { newColumn } = req.body;
        if (!newColumn) throw new Error("newColumn is required");

        const fetched = await redis.get("columns");
        const existing = Array.isArray(fetched) ? fetched : [];

        const updated = [...existing, newColumn];

        await redis.set("columns", updated);

        return res.status(201).json(updated);
      }

      case "PUT": {
        const { columns } = req.body;
        if (!Array.isArray(columns)) throw new Error("columns must be an array");

        await redis.set("columns", columns);
        return res.status(200).json(columns);
      }

      case "DELETE": {
        const { columnToDelete } = req.body;
        if (!columnToDelete) throw new Error("columnToDelete is required");

        const fetched = await redis.get("columns");
        const existing = Array.isArray(fetched) ? fetched : [];

        const updated = existing.filter((col: string) => col !== columnToDelete);

        await redis.set("columns", updated);
        await redis.del(`tasks:${columnToDelete}`);

        return res.status(200).json(updated);
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("❌ API Error:", error.message);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}



