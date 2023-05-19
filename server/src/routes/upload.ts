import { randomUUID } from 'node:crypto'
import { extname, resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request: FastifyRequest, reply: FastifyReply) => {
    const upload = await request.file({
      limits: {
        fieldSize: 5_242_880, // 5mb
      },
    })

    if (!upload) return reply.status(400).send()

    const mimitypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimitypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) return reply.status(400).send()

    const fileId = randomUUID()
    const extension = extname(upload.filename)

    const fileName = fileId.concat(extension)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/', fileName),
    )

    await pump(upload.file, writeStream)

    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return { fileUrl }
  })
}
