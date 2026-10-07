import polityIndex from '../data/subjects/polity/index.json'
import historyIndex from '../data/subjects/history/index.json'
import geographyIndex from '../data/subjects/geography/index.json'
import economyIndex from '../data/subjects/economy/index.json'
import currentAffairsIndex from '../data/subjects/current-affairs/index.json'

import parliament from '../data/subjects/polity/parliament.json'
import constitutionalBodies from '../data/subjects/polity/constitutional-bodies.json'
import fundamentalRights from '../data/subjects/polity/fundamental-rights.json'
import importantArticles from '../data/subjects/polity/important-articles.json'
import supremeCourtJudgments from '../data/subjects/polity/supreme-court-judgments.json'
import makingOfConstitution from '../data/subjects/polity/making-of-constitution.json'
import borrowedFeatures from '../data/subjects/polity/borrowed-features.json'
import schedules from '../data/subjects/polity/schedules.json'
import speaker from '../data/subjects/polity/speaker.json'
import polityTimeline from '../data/subjects/polity/polity-timeline.json'
import primeMinisters from '../data/subjects/polity/prime-ministers.json'
import supremeCourtHighCourts from '../data/subjects/polity/supreme-court-high-courts.json'

import indusValley from '../data/subjects/history/indus-valley.json'
import nationalMovement from '../data/subjects/history/national-movement.json'
import charterActs from '../data/subjects/history/charter-acts.json'
import freedomStruggleTimeline from '../data/subjects/history/freedom-struggle-timeline.json'
import viceroys from '../data/subjects/history/viceroys.json'
import artArchitecture from '../data/subjects/history/art-architecture.json'
import constitutionalDevelopments from '../data/subjects/history/constitutional-developments.json'
import agriculturalRevolutions from '../data/subjects/history/agricultural-revolutions.json'
import partitionOfBengal from '../data/subjects/history/partition-of-bengal.json'
import akbarConquests from '../data/subjects/history/akbar-conquests.json'
import ashokanEdicts from '../data/subjects/history/ashokan-edicts.json'

import nationalParks from '../data/subjects/geography/national-parks.json'
import largestInAsia from '../data/subjects/geography/largest-in-asia.json'
import stateNicknames from '../data/subjects/geography/state-nicknames.json'
import lakes from '../data/subjects/geography/lakes.json'
import riverTributaries from '../data/subjects/geography/river-tributaries.json'
import crops from '../data/subjects/geography/crops.json'
import tribalFestivals from '../data/subjects/geography/tribal-festivals.json'

import fiveYearPlans from '../data/subjects/economy/five-year-plans.json'

import worldOrganizations from '../data/subjects/current-affairs/world-organizations.json'
import importantIndices from '../data/subjects/current-affairs/important-indices.json'

import timelineData from '../data/timeline.json'
import knowledgeGraph from '../data/knowledge-graph.json'
import additionalQuestions from '../data/quizzes/additional-questions.json'

export const subjects = [
  polityIndex,
  historyIndex,
  geographyIndex,
  economyIndex,
  currentAffairsIndex,
]

const topicData = {
  polity: {
    parliament,
    'constitutional-bodies': constitutionalBodies,
    'fundamental-rights': fundamentalRights,
    'important-articles': importantArticles,
    'supreme-court-judgments': supremeCourtJudgments,
    'making-of-constitution': makingOfConstitution,
    'borrowed-features': borrowedFeatures,
    schedules,
    speaker,
    'polity-timeline': polityTimeline,
    'prime-ministers': primeMinisters,
    'supreme-court-high-courts': supremeCourtHighCourts,
  },
  history: {
    'indus-valley': indusValley,
    'national-movement': nationalMovement,
    'charter-acts': charterActs,
    'freedom-struggle-timeline': freedomStruggleTimeline,
    viceroys,
    'art-architecture': artArchitecture,
    'constitutional-developments': constitutionalDevelopments,
    'agricultural-revolutions': agriculturalRevolutions,
    'partition-of-bengal': partitionOfBengal,
    'akbar-conquests': akbarConquests,
    'ashokan-edicts': ashokanEdicts,
  },
  geography: {
    'national-parks': nationalParks,
    'largest-in-asia': largestInAsia,
    'state-nicknames': stateNicknames,
    lakes,
    'river-tributaries': riverTributaries,
    crops,
    'tribal-festivals': tribalFestivals,
  },
  economy: {
    'five-year-plans': fiveYearPlans,
  },
  'current-affairs': {
    'world-organizations': worldOrganizations,
    'important-indices': importantIndices,
  },
}

export function getSubjectTopics(subjectId) {
  const subject = subjects.find((s) => s.id === subjectId)
  if (!subject) return []
  return subject.topics
}

export function getTopicData(subjectId, topicId) {
  return topicData[subjectId]?.[topicId] || null
}

export function getRelatedTopics(topicId) {
  const related = []
  for (const [subjectId, topics] of Object.entries(topicData)) {
    for (const [id, topic] of Object.entries(topics)) {
      if (id !== topicId && topic.connections?.includes(topicId)) {
        related.push({
          id,
          title: topic.title,
          subject: subjectId,
        })
      }
    }
  }
  return related
}

export function getAllTopics() {
  const all = []
  for (const [subjectId, topics] of Object.entries(topicData)) {
    for (const [id, topic] of Object.entries(topics)) {
      all.push({
        id,
        subject: subjectId,
        title: topic.title,
        description: topic.description,
      })
    }
  }
  return all
}

export function getAllMnemonics(subjectId = null) {
  const all = []
  for (const [sid, topics] of Object.entries(topicData)) {
    if (subjectId && sid !== subjectId) continue
    for (const [tid, topic] of Object.entries(topics)) {
      for (const m of topic.content?.mnemonics || []) {
        all.push({
          topic: m.topic,
          trick: m.trick,
          explanation: m.explanation,
          subject: sid,
          topicId: tid,
          topicTitle: topic.title,
        })
      }
    }
  }
  return all
}

export function getTimelineEvents() {
  return timelineData.events
}

export function getKnowledgeGraph() {
  return knowledgeGraph
}

export function getQuizQuestions(subjectId, topicId = null) {
  const questions = []
  const topics = topicData[subjectId]
  if (!topics) return questions

  for (const [tid, topic] of Object.entries(topics)) {
    if (topicId && tid !== topicId) continue
    if (topic.quiz) {
      for (const q of topic.quiz) {
        questions.push({
          ...q,
          topicId: tid,
          topicTitle: topic.title,
        })
      }
    }
  }

  // Merge additional questions
  const additional = additionalQuestions[subjectId] || []
  for (const q of additional) {
    if (topicId && q.topicId !== topicId) continue
    const topic = topics[q.topicId]
    questions.push({
      question: q.question,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation,
      topicId: q.topicId,
      topicTitle: topic ? topic.title : 'General',
    })
  }

  return questions
}
