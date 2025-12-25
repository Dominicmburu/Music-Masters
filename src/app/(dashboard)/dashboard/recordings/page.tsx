'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Video, Play, Clock, Music, ExternalLink, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatDate, getInstrumentEmoji } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Recording {
  id: string
  title: string
  description: string | null
  youtubeUrl: string
  thumbnailUrl: string | null
  duration: string | null
  recordedAt: string
  instrument: { name: string; icon: string } | null
  sharedAt: string
  viewedAt: string | null
  message: string | null
}

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => { fetchRecordings() }, [])

  const fetchRecordings = async () => {
    try {
      const res = await fetch('/api/recordings/shared')
      const data = await res.json()
      if (data.recordings) setRecordings(data.recordings)
    } catch (error) { toast.error('Failed to load recordings') }
    finally { setLoading(false) }
  }

  const markAsViewed = async (id: string) => {
    try {
      await fetch(`/api/recordings/shared/${id}/view`, { method: 'POST' })
    } catch (error) { console.error('Failed to mark as viewed') }
  }

  const handleWatch = (recording: Recording) => {
    if (!recording.viewedAt) markAsViewed(recording.id)
    window.open(recording.youtubeUrl, '_blank')
  }

  const filteredRecordings = recordings.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.instrument?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display text-charcoal-900">Class Recordings</h1>
        <p className="text-charcoal-500 mt-1">Watch recordings shared by your instructor</p>
      </motion.div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
            <Input placeholder="Search recordings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12" />
          </div>
        </CardContent>
      </Card>

      {/* Recordings */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-video bg-charcoal-100 rounded-xl animate-pulse" />
              <div className="h-4 bg-charcoal-100 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-charcoal-100 rounded animate-pulse w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredRecordings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Video className="w-20 h-20 text-charcoal-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-charcoal-900 mb-2">No Recordings Yet</h3>
            <p className="text-charcoal-500 max-w-md mx-auto">
              {searchQuery 
                ? 'No recordings found matching your search.' 
                : 'Your instructor will share class recordings with you here. Check back after your lessons!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordings.map((recording, index) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleWatch(recording)}>
                <div className="aspect-video bg-charcoal-200 relative">
                  {recording.thumbnailUrl ? (
                    <img src={recording.thumbnailUrl} alt={recording.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-16 h-16 text-charcoal-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                  </div>
                  {recording.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" />{recording.duration}
                    </span>
                  )}
                  {!recording.viewedAt && (
                    <Badge className="absolute top-2 left-2 bg-coral-500">New</Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-charcoal-900 mb-1 group-hover:text-coral-500 transition-colors line-clamp-2">
                    {recording.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-charcoal-500 mb-2">
                    {recording.instrument && (
                      <>
                        <span>{recording.instrument.icon || getInstrumentEmoji(recording.instrument.name)}</span>
                        <span>{recording.instrument.name}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{formatDate(recording.sharedAt, 'MMM d, yyyy')}</span>
                  </div>
                  {recording.description && (
                    <p className="text-sm text-charcoal-500 line-clamp-2">{recording.description}</p>
                  )}
                  {recording.message && (
                    <div className="mt-3 p-3 bg-coral-50 rounded-lg border border-coral-100">
                      <p className="text-sm text-coral-700 italic">"{recording.message}"</p>
                      <p className="text-xs text-coral-500 mt-1">— Your Instructor</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
