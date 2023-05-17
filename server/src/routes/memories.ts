import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories.map((memory) => ({
      id: memory.id,
      coverUrl: memory.coverUrl,
      excerpt: memory.content.substring(0, 115).concat('...'),
    }))
  })

  app.get('/memories/:id', async (request: FastifyRequest) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  })

  app.post(
    '/memories',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const bodySchema = z.object({
        content: z.string(),
        coverUrl: z.string(),
        isPublic: z.coerce.boolean().default(false),
      })

      const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

      const memory = await prisma.memory.create({
        data: {
          content,
          coverUrl,
          isPublic,
          userId: '06fed0ee-5064-4363-8a2b-c35c3d086f57',
        },
      })

      return reply.send(memory).status(201)
    },
  )

  app.put(
    '/memories/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })

      const bodySchema = z.object({
        content: z.string(),
        coverUrl: z.string(),
        isPublic: z.coerce.boolean().default(false),
      })

      const { id } = paramsSchema.parse(request.params)
      const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

      const memory = await prisma.memory.update({
        where: { id },
        data: {
          content,
          coverUrl,
          isPublic,
        },
      })

      return reply.send(memory)
    },
  )

  app.delete(
    '/memories/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = paramsSchema.parse(request.params)

      await prisma.memory.delete({
        where: {
          id,
        },
      })

      return reply.status(200)
    },
  )
}
