import { useState, useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { getKnowledgeGraph } from '../utils/data'

const subjectColors = {
  polity: '#3B82F6',
  history: '#EF4444',
  geography: '#10B981',
  economy: '#F59E0B',
  'current-affairs': '#8B5CF6',
}

export default function MindMap() {
  const graph = getKnowledgeGraph()
  const [selectedSubject, setSelectedSubject] = useState('all')

  const filteredNodes = selectedSubject === 'all'
    ? graph.nodes
    : graph.nodes.filter((n) => n.subject === selectedSubject)

  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id))
  const filteredEdges = graph.edges.filter(
    (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
  )

  // Group nodes by subject into clean grid columns — no overlaps
  const subjectOrder = ['polity', 'history', 'geography', 'economy', 'current-affairs']
  const presentSubjects = subjectOrder.filter((s) =>
    filteredNodes.some((n) => n.subject === s)
  )

  const NODE_W = 180
  const NODE_H = 56
  const COL_GAP = 40
  const ROW_GAP = 24
  const COLS_PER_SUBJECT = 2

  const positions = {}
  presentSubjects.forEach((subject, si) => {
    const nodesInSubject = filteredNodes.filter((n) => n.subject === subject)
    nodesInSubject.forEach((node, ni) => {
      const col = ni % COLS_PER_SUBJECT
      const row = Math.floor(ni / COLS_PER_SUBJECT)
      positions[node.id] = {
        x: si * (COLS_PER_SUBJECT * NODE_W + COL_GAP) + col * (NODE_W + 12),
        y: row * (NODE_H + ROW_GAP),
      }
    })
  })

  const initialNodes = filteredNodes.map((node) => ({
    id: node.id,
    position: positions[node.id] || { x: 0, y: 0 },
    data: { label: node.label, subject: node.subject },
    style: {
      background: subjectColors[node.subject] || '#6B7280',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '11px',
      fontWeight: 'bold',
      width: NODE_W,
      textAlign: 'center',
    },
  }))

  const initialEdges = filteredEdges.map((edge) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    animated: true,
    style: { stroke: '#94A3B8', strokeWidth: 2 },
    labelStyle: { fontSize: 10, fill: '#475569' },
    labelBgStyle: { fill: '#F1F5F9', fillOpacity: 0.8 },
  }))

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params) => setEdges((eds) => [...eds, params]),
    [setEdges]
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Knowledge Mind Map</h1>
        <p className="text-gray-600 mb-4">
          Visual connections between topics, events, and concepts across all subjects.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedSubject === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Subjects
          </button>
          {Object.entries(subjectColors).map(([subject, color]) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSubject === subject
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={
                selectedSubject === subject
                  ? { backgroundColor: color }
                  : {}
              }
            >
              {subject.charAt(0).toUpperCase() + subject.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden" style={{ height: '65vh', minHeight: '480px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#E2E8F0" gap={20} />
          <Controls />
          <MiniMap
            nodeColor={(n) => subjectColors[n.data?.subject] || '#6B7280'}
            maskColor="rgba(0,0,0,0.1)"
          />
        </ReactFlow>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Legend</h2>
        <div className="flex flex-wrap gap-4">
          {Object.entries(subjectColors).map(([subject, color]) => (
            <div key={subject} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-700 capitalize">
                {subject.replace('-', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
