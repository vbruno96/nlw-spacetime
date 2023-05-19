import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { NewMemorieForm } from '@/app/components/NewMemorieForm'

export default function NewMemory() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timeline
      </Link>

      <NewMemorieForm />
    </div>
  )
}
