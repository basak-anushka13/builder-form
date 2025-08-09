export interface FormField {
  id: string
  type: 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox'
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
}

export interface Form {
  _id?: string
  title: string
  description?: string
  fields: FormField[]
  createdAt?: string
  updatedAt?: string
}

export interface FormResponse {
  _id?: string
  formId: string
  responses: Record<string, any>
  submittedAt?: string
}

export interface DemoResponse {
  message: string
  timestamp: string
}
