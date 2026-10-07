import { getKnowledgeGraph } from './data'

export function getConnections(topicId) {
  const graph = getKnowledgeGraph()
  const connections = []

  for (const edge of graph.edges) {
    if (edge.source === topicId) {
      const targetNode = graph.nodes.find((n) => n.id === edge.target)
      if (targetNode) {
        connections.push({
          id: targetNode.id,
          label: targetNode.label,
          subject: targetNode.subject,
          relationship: edge.label,
        })
      }
    } else if (edge.target === topicId) {
      const sourceNode = graph.nodes.find((n) => n.id === edge.source)
      if (sourceNode) {
        connections.push({
          id: sourceNode.id,
          label: sourceNode.label,
          subject: sourceNode.subject,
          relationship: edge.label,
        })
      }
    }
  }

  return connections
}

export function getConnectedTopics(topicId) {
  const graph = getKnowledgeGraph()
  const connected = new Set()

  for (const edge of graph.edges) {
    if (edge.source === topicId) connected.add(edge.target)
    if (edge.target === topicId) connected.add(edge.source)
  }

  return Array.from(connected)
}
