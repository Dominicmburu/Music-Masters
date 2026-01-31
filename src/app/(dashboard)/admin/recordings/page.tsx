'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Video, Plus, Search, Play, Share2, Trash2, Users, UserMinus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Recording {
  id: string
  title: string
  description: string | null
  youtubeUrl: string
  thumbnailUrl: string | null
  duration: string | null
  instrumentId: string | null
  recordedAt: string
  instrument: { id: string; name: string } | null
  sharedWith: { user: { id: string; firstName: string; lastName: string } }[]
}

interface Student { id: string; firstName: string; lastName: string; email: string }

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [recordingsRes, studentsRes] = await Promise.all([
        fetch('/api/admin/recordings'),
        fetch('/api/admin/students'),
      ])
      const [recordingsData, studentsData] = await Promise.all([recordingsRes.json(), studentsRes.json()])
      if (recordingsData.recordings) setRecordings(recordingsData.recordings)
      if (studentsData.students) setStudents(studentsData.students)
    } catch (error) { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }

  const handleShare = async () => {
    if (!selectedRecording || selectedStudents.length === 0) {
      toast.error('Please select at least one student')
      return
    }
    try {
      const res = await fetch(`/api/admin/recordings/${selectedRecording.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentIds: selectedStudents, message: shareMessage }),
      })
      if (!res.ok) throw new Error('Failed to share')
      fetchData()
      setShowShareDialog(false)
      setSelectedStudents([])
      setShareMessage('')
      toast.success(`Recording shared with ${selectedStudents.length} student(s)`)
    } catch (error) { toast.error('Failed to share recording') }
  }

  const handleDelete = async (recording: Recording) => {
    if (!confirm(`Are you sure you want to delete "${recording.title}"? This action cannot be undone.`)) return
    try {
      const res = await fetch(`/api/admin/recordings/${recording.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setRecordings(recordings.filter(r => r.id !== recording.id))
      toast.success('Recording deleted')
    } catch (error) { toast.error('Failed to delete recording') }
  }

  const handleUnshare = async (recordingId: string, studentId: string) => {
    try {
      const res = await fetch(`/api/admin/recordings/${recordingId}/share?studentId=${studentId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to unshare')
      setRecordings(recordings.map(r => {
        if (r.id === recordingId) {
          return { ...r, sharedWith: r.sharedWith.filter(sw => sw.user.id !== studentId) }
        }
        return r
      }))
      if (selectedRecording?.id === recordingId) {
        setSelectedRecording({ ...selectedRecording, sharedWith: selectedRecording.sharedWith.filter(sw => sw.user.id !== studentId) })
      }
      toast.success('Recording unshared')
    } catch (error) { toast.error('Failed to unshare recording') }
  }

  const openShareDialog = (recording: Recording) => {
    setSelectedRecording(recording)
    setSelectedStudents([])
    setShareMessage('')
    setShowShareDialog(true)
  }

  const filteredRecordings = recordings.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.instrument?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-charcoal-900">Class Recordings</h1>
            <p className="text-charcoal-500 mt-1">Manage and share recorded lessons with students</p>
          </div>
          <Link href="/admin/recordings/new">
            <Button className="gap-2"><Plus className="w-5 h-5" />Add Recording</Button>
          </Link>
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

        {/* Recordings Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
          </div>
        ) : filteredRecordings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Video className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
              <p className="text-charcoal-500">{searchQuery ? 'No recordings found' : 'No recordings yet'}</p>
              <Link href="/admin/recordings/new">
                <Button className="mt-4">Add Your First Recording</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecordings.map((recording) => (
              <Card key={recording.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-charcoal-200 relative group">
                  {recording.thumbnailUrl && <img src={recording.thumbnailUrl} alt={recording.title} className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <a href={recording.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </a>
                  </div>
                  {recording.duration && <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{recording.duration}</span>}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-charcoal-900 mb-1">{recording.title}</h3>
                  <p className="text-sm text-charcoal-500 mb-3">{recording.instrument?.name || 'No instrument'} • {formatDate(recording.recordedAt, 'MMM d, yyyy')}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary"><Users className="w-3 h-3 mr-1" />{recording.sharedWith.length} shared</Badge>
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => openShareDialog(recording)}>
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Share</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(recording)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Share "{selectedRecording?.title}"</DialogTitle></DialogHeader>
            <div className="space-y-4">
              {/* Currently Shared With */}
              {selectedRecording && selectedRecording.sharedWith.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Currently Shared With</label>
                  <div className="border border-charcoal-200 rounded-xl p-2 space-y-2 bg-charcoal-50">
                    {selectedRecording.sharedWith.map((share) => (
                      <div key={share.user.id} className="flex items-center gap-3 p-2 rounded-lg bg-white">
                        <span className="text-sm flex-1">{share.user.firstName} {share.user.lastName}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUnshare(selectedRecording.id, share.user.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                            >
                              <UserMinus className="w-4 h-4 mr-1" />
                              Unshare
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove access</TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share With New Students */}
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">Share with Students</label>
                <div className="max-h-48 overflow-y-auto border border-charcoal-200 rounded-xl p-2 space-y-2">
                  {students.filter(s => !selectedRecording?.sharedWith.some(sw => sw.user.id === s.id)).map((student) => (
                    <label key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-charcoal-50 cursor-pointer">
                      <Checkbox checked={selectedStudents.includes(student.id)} onCheckedChange={(checked) => {
                        if (checked) setSelectedStudents([...selectedStudents, student.id])
                        else setSelectedStudents(selectedStudents.filter(id => id !== student.id))
                      }} />
                      <span className="text-sm">{student.firstName} {student.lastName}</span>
                      <span className="text-xs text-charcoal-400 ml-auto">{student.email}</span>
                    </label>
                  ))}
                  {students.filter(s => !selectedRecording?.sharedWith.some(sw => sw.user.id === s.id)).length === 0 && (
                    <p className="text-sm text-charcoal-500 text-center py-4">Already shared with all students</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-charcoal-700">Message (optional)</label>
                <Textarea value={shareMessage} onChange={(e) => setShareMessage(e.target.value)} placeholder="Add a personal message for new shares..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>Close</Button>
              <Button onClick={handleShare} disabled={selectedStudents.length === 0}>
                Share with {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
