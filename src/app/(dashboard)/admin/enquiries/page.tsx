'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, MessageSquare, CheckCircle, Clock, Search, Loader2, Eye, Trash2, Send, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import toast from 'react-hot-toast'

interface Enquiry {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  isRead: boolean
  response: string | null
  repliedAt: string | null
  createdAt: string
}

interface Stats {
  total: number
  unread: number
  replied: number
  pending: number
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, unread: 0, replied: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchEnquiries()
  }, [search, statusFilter])

  const fetchEnquiries = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const res = await fetch(`/api/admin/enquiries?${params}`)
      const data = await res.json()

      if (data.enquiries) {
        setEnquiries(data.enquiries)
        setStats(data.stats)
      }
    } catch (error) {
      toast.error('Failed to load enquiries')
    } finally {
      setLoading(false)
    }
  }

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Enquiry deleted')
        fetchEnquiries()
      } else {
        toast.error('Failed to delete enquiry')
      }
    } catch (error) {
      toast.error('Failed to delete enquiry')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (enquiry: Enquiry) => {
    if (enquiry.response) {
      return <Badge className="bg-green-100 text-green-700">Replied</Badge>
    }
    if (!enquiry.isRead) {
      return <Badge className="bg-blue-100 text-blue-700">New</Badge>
    }
    return <Badge variant="secondary">Pending</Badge>
  }

  return (
    <TooltipProvider>
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Enquiries</h1>
          <p className="text-charcoal-600 mt-1">Manage contact form submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-600">Total Enquiries</CardTitle>
            <MessageSquare className="w-5 h-5 text-charcoal-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-charcoal-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-600">Unread</CardTitle>
            <Mail className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stats.unread}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-600">Pending Reply</CardTitle>
            <Clock className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-600">Replied</CardTitle>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.replied}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
              <Input
                placeholder="Search by name, email, or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-[180px] h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">All Enquiries</option>
              <option value="unread">Unread</option>
              <option value="pending">Pending Reply</option>
              <option value="replied">Replied</option>
            </select>
            <Button variant="outline" onClick={fetchEnquiries} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enquiries Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
              <p className="text-charcoal-600">No enquiries found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.map((enquiry) => (
                  <TableRow key={enquiry.id} className={!enquiry.isRead ? 'bg-blue-50/50' : ''}>
                    <TableCell>{getStatusBadge(enquiry)}</TableCell>
                    <TableCell>
                      <div>
                        <p className={`font-medium ${!enquiry.isRead ? 'text-charcoal-900' : 'text-charcoal-700'}`}>
                          {enquiry.name}
                        </p>
                        <p className="text-sm text-charcoal-500">{enquiry.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{enquiry.subject}</TableCell>
                    <TableCell className="text-sm text-charcoal-500">{formatDate(enquiry.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/enquiries/${enquiry.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="w-5 h-5" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>View</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/enquiries/${enquiry.id}/reply`}>
                              <Button variant="ghost" size="icon">
                                <Send className="w-5 h-5" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>Reply</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteEnquiry(enquiry.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  )
}
