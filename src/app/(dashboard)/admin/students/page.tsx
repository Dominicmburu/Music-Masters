'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Search, Plus, Mail, Phone, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { formatDate, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Student {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  avatar: string | null
  isActive: boolean
  createdAt: string
  _count: { bookings: number }
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => { fetchStudents() }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students')
      const data = await res.json()
      if (data.students) setStudents(data.students)
    } catch (error) { toast.error('Failed to load students') }
    finally { setLoading(false) }
  }

  const handleDelete = async () => {
    if (!selectedStudent) return
    try {
      const res = await fetch(`/api/admin/students/${selectedStudent.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setStudents(students.filter(s => s.id !== selectedStudent.id))
      toast.success('Student deleted successfully')
      setShowDeleteDialog(false)
      setSelectedStudent(null)
    } catch (error) { toast.error('Failed to delete student') }
  }

  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-charcoal-900">Students</h1>
          <p className="text-charcoal-500 mt-1">Manage your student database</p>
        </div>
        <Link href="/admin/students/new"><Button className="gap-2"><Plus className="w-5 h-5" />Add Student</Button></Link>
      </motion.div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
            <Input placeholder="Search students by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12" />
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-coral-500" />All Students ({filteredStudents.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 bg-charcoal-100 rounded-xl animate-pulse" />)}</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
              <p className="text-charcoal-500">{searchQuery ? 'No students found matching your search' : 'No students yet'}</p>
              <Link href="/admin/students/new"><Button className="mt-4">Add Your First Student</Button></Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-charcoal-100">
                    <th className="table-header">Student</th>
                    <th className="table-header">Contact</th>
                    <th className="table-header">Bookings</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Joined</th>
                    <th className="table-header text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-charcoal-50 hover:bg-charcoal-50 transition-colors">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar><AvatarImage src={student.avatar || undefined} /><AvatarFallback className="bg-coral-100 text-coral-600">{getInitials(student.firstName, student.lastName)}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-medium text-charcoal-900">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-charcoal-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2 text-charcoal-500">
                          {student.phone ? <><Phone className="w-4 h-4" /><span className="text-sm">{student.phone}</span></> : <span className="text-sm text-charcoal-400">No phone</span>}
                        </div>
                      </td>
                      <td className="table-cell"><Badge variant="secondary">{student._count.bookings} bookings</Badge></td>
                      <td className="table-cell"><Badge variant={student.isActive ? 'success' : 'destructive'}>{student.isActive ? 'Active' : 'Inactive'}</Badge></td>
                      <td className="table-cell text-charcoal-500">{formatDate(student.createdAt, 'MMM d, yyyy')}</td>
                      <td className="table-cell text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link href={`/admin/students/${student.id}`} className="flex items-center gap-2"><Eye className="w-4 h-4" />View Details</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/admin/students/${student.id}/edit`} className="flex items-center gap-2"><Edit className="w-4 h-4" />Edit</Link></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelectedStudent(student); setShowDeleteDialog(true) }} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Student</DialogTitle></DialogHeader>
          <p className="text-charcoal-500">Are you sure you want to delete <strong>{selectedStudent?.firstName} {selectedStudent?.lastName}</strong>? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
