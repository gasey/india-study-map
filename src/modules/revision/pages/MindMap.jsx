import { useState, useCallback, useEffect, useMemo } from 'react'
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

const subjectOrder = ['polity', 'history', 'geography', 'economy', 'current-affairs']

const NODE_W = 170
const NODE_H = 52
const COL_GAP = 90       // horizontal gap between subject columns
const COL_INNER_GAP = 14 // gap between the 2 columns inside a subject
const ROW_GAP = 30       // vertical gap between rows
const HEADER_H = 46

/** Deterministic grid layout: subject columns, 2-col grids inside, subject header on top */
function layoutGraph(nodes, edges, selectedSubject, showLabels) {
  const filteredNodes =
    selectedSubject === 'all' ? nodes : nodes.filter((n) => n.subject === selectedSubject)
  const filteredIds = new Set(filteredNodes.map((n) => n.id))
  const filteredEdges = edges.filter((e) => filteredIds.has(e.source) && filteredIds.has(e.target))

  const presentSubjects = subjectOrder.filter((s) => filteredNodes.some((n) => n.subject === s))

  const positions = {}
  presentSubjects.forEach((subject, si) => {
    const inSubject = filteredNodes.filter((n) => n.subject === subject)
    inSubject.forEach((node, ni) => {
      const col = ni % 2
      const row = Math.floor(ni / 2)
      positions[node.id] = {
        x: si * (2 * NODE_W + COL_INNER_GAP + COL_GAP) + col * (NODE_W + COL_INNER_GAP),
        y: HEADER_H + 24 + row * (NODE_H + ROW_GAP),
      }
    })
  })

  const rfNodes = filteredNodes.map((node) => ({
    id: node.id,
    position: positions[node.id] || { x: 0, y: 0 },
    data: { label: node.label, subject: node.subject },
    style: {
      background: subjectColors[node.subject] || '#6B7280',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '8px 12px',
      fontSize: '11px',
      fontWeight: 700,
      width: NODE_W,
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
  }))

  // Subject header labels (visual only, not connectable)
  presentSubjects.forEach((subject, si) => {
    rfNodes.push({
      id: `header-${subject}`,
      position: { x: si * (2 * NODE_W + COL_INNER_GAP + COL_GAP), y: 0 },
      data: { label: subject.charAt(0).toUpperCase() + subject.slice(1).replace('-', ' ') },
      draggable: false,
      selectable: false,
      deletable: false,
      style: {
        background: 'transparent',
        color: subjectColors[subject],
        border: 'none',
        fontSize: '14px',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        width: 2 * NODE_W + COL_INNER_GAP,
        textAlign: 'left',
        pointerEvents: 'none',
      },
    })
  })

  const rfEdges = filteredEdges.map((edge) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    label: showLabels ? edge.label : undefined,
    animated: false,
    type: 'smoothstep',
    style: { stroke: '#CBD5E1', strokeWidth: 1.5, opacity: 0.7 },
    labelStyle: { fontSize: 10, fill: '#64748B' },
    labelBgStyle: { fill: '#F8FAFC', fillOpacity: 0.9 },
    labelBgPadding: [4, 2],
    labelBgBorderRadius: 4,
  }))

  return { rfNodes, rfEdges }
}

export default function MindMap() {
  const graph = useMemo(() => getKnowledgeGraph(), [])
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [showLabels, setShowLabels] = useState(false)

  const { rfNodes, rfEdges } = useMemo(
    () => layoutGraph(graph.nodes, graph.edges, selectedSubject, showLabels),
    [graph, selectedSubject, showLabels]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges)

  // THE FIX: sync state when the computed layout changes (filter/labels).
  // useNodesState only reads its argument on the FIRST render.
  useEffect(() => {
    setNodes(rfNodes)
    setEdges(rfEdges)
  }, [rfNodes, rfEdges, setNodes, setEdges])

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

        <div className="flex flex-wrap gap-2 mb-4 items-center">
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
          <span className="mx-1 text-gray-300">|</span>
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showLabels
                ? 'bg-slate-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🏷️ Edge labels {showLabels ? 'on' : 'off'}
          </button>
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
          fitViewOptions={{ padding: 0.15, maxZoom: 1 }}
          minZoom={0.2}
          attributionPosition="bottom-left"
          nodesConnectable={false}
        >
          <Background color="#E2E8F0" gap={24} />
          <Controls />
          <MiniMap
            nodeColor={(n) => subjectColors[n.data?.subject] || '#94A3B8'}
            maskColor="rgba(0,0,0,0.08)"
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
        <p className="text-xs text-gray-400 mt-3">
          Drag nodes to rearrange • Scroll to zoom • Toggle 🏷️ to see how topics relate
        </p>
      </div>
    </div>
  )
}
