import { db } from "@/db";
import { agents } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schema";
import z from "zod";
import { eq } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await db.select().from(agents);
    return data;
  }),

  getOne: baseProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
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