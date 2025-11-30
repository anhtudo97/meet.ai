import { DEFAULT_PAGE } from "@/constant";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from '@trpc/server';
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import z from "zod";
import { agentsInsertSchema } from "../schema";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from './../../../constant';

export const agentsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z
        .object({
          page: z
            .number()
            .min(MIN_PAGE_SIZE)
            .default(DEFAULT_PAGE),
          pageSize: z
            .number()
            .min(MIN_PAGE_SIZE)
            .max(MAX_PAGE_SIZE)
            .default(DEFAULT_PAGE_SIZE),
          search: z.string().nullish()
        })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const data = await db
        .select({
          meetingsCount: sql<number>`7`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search
              ? ilike(agents.name, `%${search}%`)
              : undefined
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);
      const [total] = await db
        .select({
          count: count(),
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search
              ? ilike(agents.name, `%${search}%`)
              : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);
      return {
        items: data,
        total: total.count,
        totalPages
      };
    }),

  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const [existingAgent] = await db
      .select({
        meetingsCount: sql<number>`5`,
        ...getTableColumns(agents),
      })
      .from(agents)
      .where(
        and(
          eq(agents.id, input.id),
          eq(agents.userId, ctx.auth.user.id)
        ));

    if (!existingAgent) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Agent with id ${input.id} not found`
      });
    }
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