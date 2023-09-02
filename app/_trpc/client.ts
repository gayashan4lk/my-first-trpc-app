import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '@/server';

// Create a trpc client
export const trpc = createTRPCReact<AppRouter>({});
