import { RequestHandler } from 'express'
import { Form } from '../models/Form'
import { FallbackStorage } from '../storage/fallback'

let useDatabase = false

export const setDatabaseStatus = (status: boolean) => {
  useDatabase = status
}

// GET /api/forms
export const getAllForms: RequestHandler = async (req, res) => {
  try {
    if (useDatabase) {
      const forms = await Form.find().sort({ updatedAt: -1 })
      res.json(forms)
    } else {
      const forms = await FallbackStorage.getAllForms()
      res.json(forms.sort((a, b) => 
        new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      ))
    }
  } catch (error) {
    console.error('Error fetching forms:', error)
    res.status(500).json({ error: 'Failed to fetch forms' })
  }
}

// GET /api/forms/:id
export const getFormById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params
    
    if (useDatabase) {
      const form = await Form.findById(id)
      if (!form) {
        return res.status(404).json({ error: 'Form not found' })
      }
      res.json(form)
    } else {
      const form = await FallbackStorage.getFormById(id)
      if (!form) {
        return res.status(404).json({ error: 'Form not found' })
      }
      res.json(form)
    }
  } catch (error) {
    console.error('Error fetching form:', error)
    res.status(500).json({ error: 'Failed to fetch form' })
  }
}

// POST /api/forms
export const createForm: RequestHandler = async (req, res) => {
  try {
    const { title, description, fields } = req.body
    
    if (!title || !fields) {
      return res.status(400).json({ error: 'Title and fields are required' })
    }

    if (useDatabase) {
      const form = new Form({ title, description, fields })
      const savedForm = await form.save()
      res.status(201).json(savedForm)
    } else {
      const form = await FallbackStorage.createForm({ title, description, fields })
      res.status(201).json(form)
    }
  } catch (error) {
    console.error('Error creating form:', error)
    res.status(500).json({ error: 'Failed to create form' })
  }
}

// PUT /api/forms/:id
export const updateForm: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, fields } = req.body

    if (useDatabase) {
      const form = await Form.findByIdAndUpdate(
        id,
        { title, description, fields },
        { new: true, runValidators: true }
      )
      
      if (!form) {
        return res.status(404).json({ error: 'Form not found' })
      }
      
      res.json(form)
    } else {
      const form = await FallbackStorage.updateForm(id, { title, description, fields })
      if (!form) {
        return res.status(404).json({ error: 'Form not found' })
      }
      res.json(form)
    }
  } catch (error) {
    console.error('Error updating form:', error)
    res.status(500).json({ error: 'Failed to update form' })
  }
}

// DELETE /api/forms/:id
export const deleteForm: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params

    if (useDatabase) {
      const form = await Form.findByIdAndDelete(id)
      if (!form) {
        return res.status(404).json({ error: 'Form not found' })
      }
      res.json({ message: 'Form deleted successfully' })
    } else {
      const deleted = await FallbackStorage.deleteForm(id)
      if (!deleted) {
        return res.status(404).json({ error: 'Form not found' })
      }
      res.json({ message: 'Form deleted successfully' })
    }
  } catch (error) {
    console.error('Error deleting form:', error)
    res.status(500).json({ error: 'Failed to delete form' })
  }
}
