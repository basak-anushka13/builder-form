import { RequestHandler } from "express";
import Form, { IForm } from "../models/Form";

// GET /api/forms - Get all forms
export const getAllForms: RequestHandler = async (req, res) => {
  try {
    const forms = await Form.find()
      .select('title description createdAt updatedAt questions')
      .sort({ updatedAt: -1 });
    
    // Add question count to each form
    const formsWithCount = forms.map(form => ({
      id: form._id,
      title: form.title,
      description: form.description,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      questionCount: form.questions.length
    }));

    res.json(formsWithCount);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
};

// GET /api/forms/:id - Get form by ID
export const getFormById: RequestHandler = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json({
      id: form._id,
      title: form.title,
      description: form.description,
      headerImage: form.headerImage,
      questions: form.questions,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt
    });
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
};

// POST /api/forms - Create new form
export const createForm: RequestHandler = async (req, res) => {
  try {
    const { title, description, headerImage, questions } = req.body;

    const form = new Form({
      title: title || 'Untitled Form',
      description: description || '',
      headerImage,
      questions: questions || []
    });

    const savedForm = await form.save();

    res.status(201).json({
      id: savedForm._id,
      title: savedForm.title,
      description: savedForm.description,
      headerImage: savedForm.headerImage,
      questions: savedForm.questions,
      createdAt: savedForm.createdAt,
      updatedAt: savedForm.updatedAt
    });
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
};

// PUT /api/forms/:id - Update form
export const updateForm: RequestHandler = async (req, res) => {
  try {
    const { title, description, headerImage, questions } = req.body;

    const form = await Form.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        headerImage,
        questions,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json({
      id: form._id,
      title: form.title,
      description: form.description,
      headerImage: form.headerImage,
      questions: form.questions,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt
    });
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ error: 'Failed to update form' });
  }
};

// DELETE /api/forms/:id - Delete form
export const deleteForm: RequestHandler = async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ error: 'Failed to delete form' });
  }
};
