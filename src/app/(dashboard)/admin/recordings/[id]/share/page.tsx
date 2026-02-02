'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Share2, UserMinus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import toast from 'react-hot-toast'

interface Recording {
  id: string
  title: string
  description: string | null
  youtubeUrl: string
  thumbnailUrl: string | null
  sharedWith: { user: { id: string; firstName: string; lastName: string; email: string } }[]
}

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
}

export default function ShareRecordingPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [recording, setRecording] = useState<Recording | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [recordingRes, studentsRes] = await Promise.all([
        fetch(`/api/admin/recordings/${id}`),
        fetch('/api/admin/students'),
      ])

      if (!recordingRes.ok) {
        toast.error('Recording not found')
        router.push('/admin/recordings')
        return
      }

      const [recordingData, studentsData] = await Promise.all([
        recordingRes.json(),
        studentsRes.json(),
      ])

      if (recordingData.recording) setRecording(recordingData.recording)
      if (studentsData.students) setStudents(studentsData.students)
    } catch (error) {
      toast.error('Failed to load data')
      router.push('/admin/recordings')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/recordings/${id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentIds: selectedStudents, message: shareMessage }),
      })

      if (!res.ok) throw new Error('Failed to share')

      toast.success(`Recording shared with ${selectedStudents.length} student(s)`)
      router.push('/admin/recordings')
    } catch (error) {
      toast.error('Failed to share recording')
    } finally {
      setSaving(false)
    }
  }

  const handleUnshare = async (studentId: string) => {
    try {
      const res = await fetch(`/api/admin/recordings/${id}/share?studentId=${studentId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to unshare')

      setRecording(prev => {
        if (!prev) return prev
        return {
          ...prev,
          sharedWith: prev.sharedWith.filter(sw => sw.user.id !== studentId),
        }
      })
      toast.success('Recording unshared')
    } catch (error) {
      toast.error('Failed to unshare recording')
    }
  }

  const toggleStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId])
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId))
    }
  }

  const availableStudents = students.filter(
    s => !recording?.sharedWith.some(sw => sw.user.id === s.id)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
      </div>
    )
  }

  if (!recording) {
    return null
  }

  return (
    <TooltipProvider>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/recordings">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-display text-charcoal-900">Share Recording</h1>
            <p className="text-charcoal-500">{recording.title}</p>
          </div>
        </div>

        {/* Recording Preview */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              {recording.thumbnailUrl && (
                <img
                  src={recording.thumbnailUrl}
                  alt={recording.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="font-semibold text-charcoal-900">{recording.title}</h3>
                {recording.description && (
                  <p className="text-sm text-charcoal-500 mt-1">{recording.description}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currently Shared With */}
        {recording.sharedWith.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-coral-500" />
                Currently Shared With ({recording.sharedWith.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recording.sharedWith.map((share) => (
                  <div
                    key={share.user.id}
                    className="flex items-center justify-between p-3 bg-charcoal-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-charcoal-900">
                        {share.user.firstName} {share.user.lastName}
                      </p>
                      <p className="text-sm text-charcoal-500">{share.user.email}</p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUnshare(share.user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            </CardContent>
          </Card>
        )}

        {/* Share With New Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="w-5 h-5 text-coral-500" />
              Share with Students
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableStudents.length === 0 ? (
              <p className="text-center text-charcoal-500 py-8">
                This recording has been shared with all students
              </p>
            ) : (
              <>
                <div className="max-h-64 overflow-y-auto border border-charcoal-200 rounded-xl p-2 space-y-2">
                  {availableStudents.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-charcoal-50 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={(checked) => toggleStudent(student.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-charcoal-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-charcoal-500">{student.email}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Message (optional)</Label>
                  <Textarea
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    placeholder="Add a personal message for the students..."
                    rows={3}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/admin/recordings">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                onClick={handleShare}
                disabled={saving || selectedStudents.length === 0}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share with {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
