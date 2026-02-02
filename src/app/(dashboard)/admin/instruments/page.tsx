'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Music, Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import toast from 'react-hot-toast'

interface Instrument {
  id: string
  name: string
  description: string | null
  icon: string | null
  isActive: boolean
  _count: { lessons: number; bookings: number; recordings: number }
}

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchInstruments()
  }, [])

  const fetchInstruments = async () => {
    try {
      const res = await fetch('/api/admin/instruments')
      const data = await res.json()
      if (data.instruments) setInstruments(data.instruments)
    } catch (error) {
      toast.error('Failed to load instruments')
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (instrument: Instrument) => {
    try {
      const res = await fetch(`/api/admin/instruments/${instrument.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !instrument.isActive }),
      })

      if (res.ok) {
        setInstruments(instruments.map(i =>
          i.id === instrument.id ? { ...i, isActive: !i.isActive } : i
        ))
        toast.success(`Instrument ${!instrument.isActive ? 'activated' : 'deactivated'}`)
      }
    } catch (error) {
      toast.error('Failed to update instrument')
    }
  }

  const handleDelete = async (instrument: Instrument) => {
    if (!confirm(`Are you sure you want to delete "${instrument.name}"? This action cannot be undone.`)) return

    try {
      const res = await fetch(`/api/admin/instruments/${instrument.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Instrument deleted')
        fetchInstruments()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete')
      }
    } catch (error) {
      toast.error('Failed to delete instrument')
    }
  }

  const filteredInstruments = instruments.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold font-display text-charcoal-900">Instruments</h1>
            <p className="text-charcoal-500 mt-1">Manage musical instruments offered</p>
          </div>
          <Link href="/admin/instruments/new">
            <Button className="gap-2">
              <Plus className="w-5 h-5" />
              Add Instrument
            </Button>
          </Link>
        </motion.div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
              <Input
                placeholder="Search instruments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5 text-coral-500" />
              All Instruments ({filteredInstruments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
              </div>
            ) : filteredInstruments.length === 0 ? (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
                <p className="text-charcoal-500">No instruments found</p>
                <Link href="/admin/instruments/new">
                  <Button className="mt-4">Add Your First Instrument</Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instrument</TableHead>
                    <TableHead>Lessons</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstruments.map((instrument) => (
                    <TableRow key={instrument.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{instrument.icon || '🎵'}</span>
                          <div>
                            <p className="font-medium">{instrument.name}</p>
                            {instrument.description && (
                              <p className="text-sm text-charcoal-500 line-clamp-1">
                                {instrument.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{instrument._count.lessons} lessons</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{instrument._count.bookings} bookings</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={instrument.isActive ? 'success' : 'destructive'}>
                          {instrument.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleActive(instrument)}
                              >
                                {instrument.isActive ? (
                                  <ToggleRight className="w-5 h-5 text-green-600" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-charcoal-400" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {instrument.isActive ? 'Deactivate' : 'Activate'}
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/admin/instruments/${instrument.id}/edit`}>
                                <Button variant="ghost" size="icon">
                                  <Edit className="w-5 h-5" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(instrument)}
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
