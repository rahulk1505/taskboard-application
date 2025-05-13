// pages/api/tasks/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '@/lib/redis';
import NextCors from 'nextjs-cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  try {
    const method = req.method;

    switch (method) {
      case 'GET': {
        const { column, all } = req.query;

        const allTasksRaw = await redis.get('all_tasks');
        const allTasks = Array.isArray(allTasksRaw) ? allTasksRaw : [];

        // Return all tasks if ?all=true is present
        if (all === 'true') {
          return res.status(200).json(allTasks);
        }

        // If column is provided, return filtered tasks
        if (typeof column === 'string') {
          const filtered = allTasks.filter((task: any) => task.column === column);
          return res.status(200).json(filtered);
        }

        // If neither column nor all is provided, throw error
        return res.status(400).json({ error: 'Missing column in query or set all=true' });
      }

      case 'POST': {
        const { title, column } = req.body;
        if (!title || !column) {
          return res.status(400).json({ error: 'Missing title or column' });
        }

        const newTask = { id: Date.now().toString(), title, column };

        const existingRaw = await redis.get('all_tasks');
        const existing = Array.isArray(existingRaw) ? existingRaw : [];

        const updatedTasks = [...existing, newTask];
        await redis.set('all_tasks', updatedTasks);

        return res.status(201).json(newTask);
      }

      // You can later extend for PUT/DELETE if needed...
      case 'PUT': {
        const { id, newColumn } = req.body;

        if (!id || !newColumn) {
          return res.status(400).json({ error: 'Missing id or newColumn' });
        }

        const allTasksRaw = await redis.get('all_tasks');
        const allTasks = Array.isArray(allTasksRaw) ? allTasksRaw : [];

        const updatedTasks = allTasks.map((task: any) =>
          task.id === id ? { ...task, column: newColumn } : task
        );

        await redis.set('all_tasks', updatedTasks);

        const updatedTask = updatedTasks.find((t: any) => t.id === id);
        return res.status(200).json(updatedTask);
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('❌ API Error:', error.message);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
