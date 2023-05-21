import { cookies } from 'next/headers'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

import { EmptyMemories } from '@/app/components/EmptyMemories'
import { api } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Memory {
  coverUrl: string
  excerpt: string
  createdAt: string
  id: string
}

dayjs.locale(ptBr)

export default async function Home() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) return <EmptyMemories />

  const token = cookies().get('token')?.value
  const response = await api.get<Memory[]>('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories = response.data

  if (memories.length === 0) return <EmptyMemories />

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => (
        <div className="space-y-4" key={memory.id}>
          <time className="before: -ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
            {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
          </time>
          <Image
            src={memory.coverUrl}
            width={592}
            height={280}
            alt=""
            className="aspect-video w-full rounded-lg object-cover"
          />
          <p className="text-lg leading-relaxed text-gray-100">
            {memory.excerpt}
          </p>
          <Link
            className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
            href={`/memories/${memory.id}`}
          >
            Ler mais
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ))}
    </div>
  )
}
