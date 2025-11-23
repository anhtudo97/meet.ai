import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";
import z from "zod";
import { agentsInsertSchema } from "../schema";

export const agentsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const data = await db.select().from(agents);
    return data;
  }),

  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, input.id));
    return existingAgent;
  }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createAgent] = await db.insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        }).returning();
      return createAgent;
    }),
});