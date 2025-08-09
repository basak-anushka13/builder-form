import { RequestHandler } from "express";
import Response, { IResponse } from "../models/Response";
import Form from "../models/Form";

// POST /api/responses - Submit form response
export const submitResponse: RequestHandler = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    // Validate that the form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Get client info
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    const response = new Response({
      formId,
      answers,
      ipAddress,
      userAgent
    });

    const savedResponse = await response.save();

    res.status(201).json({
      id: savedResponse._id,
      formId: savedResponse.formId,
      submittedAt: savedResponse.submittedAt,
      message: 'Response submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
};

// GET /api/responses/form/:formId - Get all responses for a form
export const getResponsesByForm: RequestHandler = async (req, res) => {
  try {
    const { formId } = req.params;

    // Validate that the form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const responses = await Response.find({ formId })
      .sort({ submittedAt: -1 })
      .populate('formId', 'title');

    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
};

// GET /api/responses/:id - Get specific response
export const getResponseById: RequestHandler = async (req, res) => {
  try {
    const response = await Response.findById(req.params.id)
      .populate('formId', 'title description questions');

    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching response:', error);
    res.status(500).json({ error: 'Failed to fetch response' });
  }
};

// GET /api/responses - Get all responses (with pagination)
export const getAllResponses: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const responses = await Response.find()
      .populate('formId', 'title')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Response.countDocuments();

    res.json({
      responses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
};

// DELETE /api/responses/:id - Delete response
export const deleteResponse: RequestHandler = async (req, res) => {
  try {
    const response = await Response.findByIdAndDelete(req.params.id);

    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Error deleting response:', error);
    res.status(500).json({ error: 'Failed to delete response' });
  }
};
