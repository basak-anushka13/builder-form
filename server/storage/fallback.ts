import fs from "fs/promises";
import path from "path";
import { Form as FormType, FormResponse } from "@shared/api";

const DATA_DIR = path.join(process.cwd(), "data");
const FORMS_FILE = path.join(DATA_DIR, "forms.json");
const RESPONSES_FILE = path.join(DATA_DIR, "responses.json");

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJsonFile<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeJsonFile<T>(filePath: string, data: T[]) {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export class FallbackStorage {
  // Forms
  static async getAllForms(): Promise<FormType[]> {
    return readJsonFile<FormType>(FORMS_FILE);
  }

  static async getFormById(id: string): Promise<FormType | null> {
    const forms = await this.getAllForms();
    return forms.find((form) => form._id === id) || null;
  }

  static async createForm(formData: Omit<FormType, "_id">): Promise<FormType> {
    const forms = await this.getAllForms();
    const newForm: FormType = {
      ...formData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    forms.push(newForm);
    await writeJsonFile(FORMS_FILE, forms);
    return newForm;
  }

  static async updateForm(
    id: string,
    formData: Partial<FormType>,
  ): Promise<FormType | null> {
    const forms = await this.getAllForms();
    const index = forms.findIndex((form) => form._id === id);
    if (index === -1) return null;

    forms[index] = {
      ...forms[index],
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    await writeJsonFile(FORMS_FILE, forms);
    return forms[index];
  }

  static async deleteForm(id: string): Promise<boolean> {
    const forms = await this.getAllForms();
    const filteredForms = forms.filter((form) => form._id !== id);
    if (filteredForms.length === forms.length) return false;

    await writeJsonFile(FORMS_FILE, filteredForms);
    return true;
  }

  // Responses
  static async getAllResponses(): Promise<FormResponse[]> {
    return readJsonFile<FormResponse>(RESPONSES_FILE);
  }

  static async getResponsesByFormId(formId: string): Promise<FormResponse[]> {
    const responses = await this.getAllResponses();
    return responses.filter((response) => response.formId === formId);
  }

  static async createResponse(
    responseData: Omit<FormResponse, "_id">,
  ): Promise<FormResponse> {
    const responses = await this.getAllResponses();
    const newResponse: FormResponse = {
      ...responseData,
      _id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    };
    responses.push(newResponse);
    await writeJsonFile(RESPONSES_FILE, responses);
    return newResponse;
  }
}
