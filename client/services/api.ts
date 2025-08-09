// API service for form and response operations

export interface Form {
  id: string;
  title: string;
  description: string;
  headerImage?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  questionCount?: number;
}

export interface Question {
  id: string;
  type: "categorize" | "cloze" | "comprehension";
  title: string;
  image?: string;
  data: any;
}

export interface Answer {
  questionId: string;
  type: string;
  data: any;
}

export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
  submittedAt: string;
}

const API_BASE = "/api";

// Form API functions
export const formAPI = {
  // Get all forms
  async getAllForms(): Promise<Form[]> {
    const response = await fetch(`${API_BASE}/forms`);
    if (!response.ok) {
      throw new Error("Failed to fetch forms");
    }
    return response.json();
  },

  // Get form by ID
  async getFormById(id: string): Promise<Form> {
    const response = await fetch(`${API_BASE}/forms/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch form");
    }
    return response.json();
  },

  // Create new form
  async createForm(form: Partial<Form>): Promise<Form> {
    const response = await fetch(`${API_BASE}/forms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      throw new Error("Failed to create form");
    }
    return response.json();
  },

  // Update form
  async updateForm(id: string, form: Partial<Form>): Promise<Form> {
    const response = await fetch(`${API_BASE}/forms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      throw new Error("Failed to update form");
    }
    return response.json();
  },

  // Delete form
  async deleteForm(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/forms/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete form");
    }
  },
};

// Response API functions
export const responseAPI = {
  // Submit form response
  async submitResponse(formId: string, answers: Answer[]): Promise<Response> {
    const response = await fetch(`${API_BASE}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formId, answers }),
    });
    if (!response.ok) {
      throw new Error("Failed to submit response");
    }
    return response.json();
  },

  // Get responses for a form
  async getResponsesByForm(formId: string): Promise<Response[]> {
    const response = await fetch(`${API_BASE}/responses/form/${formId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch responses");
    }
    return response.json();
  },

  // Get all responses
  async getAllResponses(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    responses: Response[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const response = await fetch(
      `${API_BASE}/responses?page=${page}&limit=${limit}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch responses");
    }
    return response.json();
  },
};
