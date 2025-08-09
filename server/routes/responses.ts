import { RequestHandler } from 'express'
import { Response } from '../models/Response'
import { FallbackStorage } from '../storage/fallback'

let useDatabase = false

export const setDatabaseStatus = (status: boolean) => {
  useDatabase = status
}

// GET /api/responses
export const getAllResponses: RequestHandler = async (req, res) => {
  try {
    const { formId } = req.query

    if (useDatabase) {
      const query = formId ? { formId } : {}
      const responses = await Response.find(query).sort({ submittedAt: -1 })
      res.json(responses)
    } else {
      if (formId) {
        const responses = await FallbackStorage.getResponsesByFormId(formId as string)
        res.json(responses)
      } else {
        const responses = await FallbackStorage.getAllResponses()
        res.json(responses.sort((a, b) => 
          new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()
        ))
      }
    }
  } catch (error) {
    console.error('Error fetching responses:', error)
    res.status(500).json({ error: 'Failed to fetch responses' })
  }
}

// POST /api/responses
export const createResponse: RequestHandler = async (req, res) => {
  try {
    const { formId, responses } = req.body
    
    if (!formId || !responses) {
      return res.status(400).json({ error: 'Form ID and responses are required' })
    }

    if (useDatabase) {
      const response = new Response({ formId, responses })
      const savedResponse = await response.save()
      res.status(201).json(savedResponse)
    } else {
      const response = await FallbackStorage.createResponse({ formId, responses })
      res.status(201).json(response)
    }
  } catch (error) {
    console.error('Error creating response:', error)
    res.status(500).json({ error: 'Failed to create response' })
  }
}
