'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Video, Plus, Search, Play, Share2, Trash2, Edit, Users, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { formatDate, getYouTubeThumbnail } from '@/lib/utils'
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
interface Instrument { id: string; name: string }

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [shareMessage, setShareMessage] = useState('')
  const [newRecording, setNewRecording] = useState({ title: '', description: '', youtubeUrl: '', instrumentId: '', duration: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [recordingsRes, studentsRes, instrumentsRes] = await Promise.all([
        fetch('/api/admin/recordings'),
        fetch('/api/admin/students'),
        fetch('/api/instruments'),
      ])
      const [recordingsData, studentsData, instrumentsData] = await Promise.all([recordingsRes.json(), studentsRes.json(), instrumentsRes.json()])
      if (recordingsData.recordings) setRecordings(recordingsData.recordings)
      if (studentsData.students) setStudents(studentsData.students)
      if (instrumentsData.instruments) setInstruments(instrumentsData.instruments)
    } catch (error) { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }

  const handleAddRecording = async () => {
    if (!newRecording.title || !newRecording.youtubeUrl) {
      toast.error('Title and YouTube URL are required')
      return
    }
    try {
      const thumbnailUrl = getYouTubeThumbnail(newRecording.youtubeUrl)
      const res = await fetch('/api/admin/recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newRecording, thumbnailUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRecordings([data.recording, ...recordings])
      setShowAddDialog(false)
      setNewRecording({ title: '', description: '', youtubeUrl: '', instrumentId: '', duration: '' })
      toast.success('Recording added successfully')
    } catch (error: any) { toast.error(error.message || 'Failed to add recording') }
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recording?')) return
    try {
      const res = await fetch(`/api/admin/recordings/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setRecordings(recordings.filter(r => r.id !== id))
      toast.success('Recording deleted')
    } catch (error) { toast.error('Failed to delete recording') }
  }

  const filteredRecordings = recordings.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.instrument?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">Class Recordings</h1>
          <p className="text-charcoal-500 mt-1">Manage and share recorded lessons with students</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2"><Plus className="w-5 h-5" />Add Recording</Button>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="aspect-video bg-charcoal-100 rounded-xl animate-pulse" />)}</div>
      ) : filteredRecordings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Video className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
            <p className="text-charcoal-500">{searchQuery ? 'No recordings found' : 'No recordings yet'}</p>
            <Button onClick={() => setShowAddDialog(true)} className="mt-4">Add Your First Recording</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordings.map((recording) => (
            <Card key={recording.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-charcoal-200 relative group">
                {recording.thumbnailUrl && <img src={recording.thumbnailUrl} alt={recording.title} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a href={recording.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center"><Play className="w-6 h-6 text-white ml-1" /></a>
                </div>
                {recording.duration && <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{recording.duration}</span>}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-charcoal-900 mb-1">{recording.title}</h3>
                <p className="text-sm text-charcoal-500 mb-3">{recording.instrument?.name} • {formatDate(recording.recordedAt, 'MMM d, yyyy')}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary"><Users className="w-3 h-3 mr-1" />{recording.sharedWith.length} shared</Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setSelectedRecording(recording); setShowShareDialog(true) }}><Share2 className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(recording.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Recording Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New Recording</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input label="Title" value={newRecording.title} onChange={(e) => setNewRecording({ ...newRecording, title: e.target.value })} placeholder="e.g., Moonlight Sonata - Piano Technique" />
            <Input label="YouTube URL" value={newRecording.youtubeUrl} onChange={(e) => setNewRecording({ ...newRecording, youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">Instrument</label>
                <Select value={newRecording.instrumentId} onValueChange={(v) => setNewRecording({ ...newRecording, instrumentId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select instrument" /></SelectTrigger>
                  <SelectContent>{instruments.map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Input label="Duration" value={newRecording.duration} onChange={(e) => setNewRecording({ ...newRecording, duration: e.target.value })} placeholder="45:30" />
            </div>
            <Textarea label="Description" value={newRecording.description} onChange={(e) => setNewRecording({ ...newRecording, description: e.target.value })} placeholder="Brief description of the lesson..." />
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button><Button onClick={handleAddRecording}>Add Recording</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Share "{selectedRecording?.title}"</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">Select Students</label>
              <div className="max-h-60 overflow-y-auto border border-charcoal-200 rounded-xl p-2 space-y-2">
                {students.map((student) => (
                  <label key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-charcoal-50 cursor-pointer">
                    <Checkbox checked={selectedStudents.includes(student.id)} onCheckedChange={(checked) => {
                      if (checked) setSelectedStudents([...selectedStudents, student.id])
                      else setSelectedStudents(selectedStudents.filter(id => id !== student.id))
                    }} />
                    <span className="text-sm">{student.firstName} {student.lastName}</span>
                    <span className="text-xs text-charcoal-400 ml-auto">{student.email}</span>
                  </label>
                ))}
              </div>
            </div>
            <Textarea label="Message (optional)" value={shareMessage} onChange={(e) => setShareMessage(e.target.value)} placeholder="Add a personal message..." />
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowShareDialog(false)}>Cancel</Button><Button onClick={handleShare} disabled={selectedStudents.length === 0}>Share with {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
