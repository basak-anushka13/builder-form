import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FormField {
  id: string
  type: 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox'
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
}

interface Form {
  _id: string
  title: string
  description?: string
  fields: FormField[]
}

export default function FormPreview() {
  const { id } = useParams()
  const [form, setForm] = useState<Form | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      fetchForm(id)
    }
  }, [id])

  const fetchForm = async (formId: string) => {
    try {
      const response = await fetch(`/api/forms/${formId}`)
      if (response.ok) {
        const data = await response.json()
        setForm(data)
      }
    } catch (error) {
      console.error('Error fetching form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formId: form._id,
          responses: formData
        })
      })

      if (response.ok) {
        alert('Form submitted successfully!')
        setFormData({})
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting form')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData({
      ...formData,
      [fieldId]: value
    })
  }

  const renderField = (field: FormField) => {
    const commonProps = {
      required: field.required,
      className: "w-full p-2 border border-input rounded-md"
    }

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            {...commonProps}
          />
        )
      case 'email':
        return (
          <input
            type="email"
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            {...commonProps}
          />
        )
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            rows={4}
            {...commonProps}
          />
        )
      case 'select':
        return (
          <select
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            {...commonProps}
          >
            <option value="">Choose an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={formData[field.id] === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                />
                {option}
              </label>
            ))}
          </div>
        )
      case 'checkbox':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData[field.id] || false}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              required={field.required}
            />
            {field.label}
          </label>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading form...</div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">Form not found</p>
            <Button asChild>
              <Link to="/forms">Back to Forms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link to="/forms">← Back to Forms</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{form.title}</CardTitle>
          {form.description && (
            <p className="text-muted-foreground">{form.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
