// In-memory storage fallback for development when MongoDB is not available

interface StoredForm {
  id: string;
  title: string;
  description: string;
  headerImage?: string;
  questions: any[];
  createdAt: Date;
  updatedAt: Date;
}

interface StoredResponse {
  id: string;
  formId: string;
  answers: any[];
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

class FallbackStorage {
  private forms: Map<string, StoredForm> = new Map();
  private responses: Map<string, StoredResponse> = new Map();
  private formCounter = 1;
  private responseCounter = 1;

  // Form operations
  createForm(
    formData: Omit<StoredForm, "id" | "createdAt" | "updatedAt">,
  ): StoredForm {
    const id = `form_${this.formCounter++}`;
    const now = new Date();
    const form: StoredForm = {
      ...formData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.forms.set(id, form);
    return form;
  }

  getAllForms(): StoredForm[] {
    return Array.from(this.forms.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    );
  }

  getFormById(id: string): StoredForm | null {
    return this.forms.get(id) || null;
  }

  updateForm(id: string, updates: Partial<StoredForm>): StoredForm | null {
    const existing = this.forms.get(id);
    if (!existing) return null;

    const updated: StoredForm = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };
    this.forms.set(id, updated);
    return updated;
  }

  deleteForm(id: string): boolean {
    return this.forms.delete(id);
  }

  // Response operations
  createResponse(
    responseData: Omit<StoredResponse, "id" | "submittedAt">,
  ): StoredResponse {
    const id = `response_${this.responseCounter++}`;
    const response: StoredResponse = {
      ...responseData,
      id,
      submittedAt: new Date(),
    };
    this.responses.set(id, response);
    return response;
  }

  getAllResponses(): StoredResponse[] {
    return Array.from(this.responses.values()).sort(
      (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime(),
    );
  }

  getResponsesByForm(formId: string): StoredResponse[] {
    return Array.from(this.responses.values())
      .filter((r) => r.formId === formId)
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }

  getResponseById(id: string): StoredResponse | null {
    return this.responses.get(id) || null;
  }

  deleteResponse(id: string): boolean {
    return this.responses.delete(id);
  }
}

export const fallbackStorage = new FallbackStorage();
