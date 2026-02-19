'use client'
import React from 'react'
import { Box, Typography, Grid, Card, CardContent, Stack } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

interface DashboardStats {
  totalJobs: number
  totalApplications: number
  totalHired: number
  jobTypes: { type: string; count: number }[]
  averageMatch: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const stats: DashboardStats = {
  totalJobs: 120,
  totalApplications: 450,
  totalHired: 32,
  jobTypes: [
    { type: 'CLT', count: 60 },
    { type: 'PJ', count: 30 },
    { type: 'Híbrido', count: 15 },
    { type: 'Remoto', count: 10 },
    { type: 'Freelancer', count: 5 }
  ],
  averageMatch: 76
}

export default function HomePage() {
  return (
    <Box p={4} bgcolor="#f3f4f6" minHeight="100vh">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
    </Box>
  )
}
