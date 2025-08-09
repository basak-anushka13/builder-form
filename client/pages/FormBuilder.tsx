import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  _id?: string
  title: string
  description?: string
  fields: FormField[]
}

export default function FormBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>({
    title: 'Untitled Form',
    description: '',
    fields: []
  })
  const [saving, setSaving] = useState(false)

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
    }
  }

  const saveForm = async () => {
    setSaving(true)
    try {
      const method = id ? 'PUT' : 'POST'
      const url = id ? `/api/forms/${id}` : '/api/forms'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      if (response.ok) {
        const savedForm = await response.json()
        if (!id) {
          navigate(`/builder/${savedForm._id}`)
        }
        alert('Form saved successfully!')
      }
    } catch (error) {
      console.error('Error saving form:', error)
      alert('Error saving form')
    } finally {
      setSaving(false)
    }
  }

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false
    }

    if (type === 'select' || type === 'radio') {
      newField.options = ['Option 1', 'Option 2']
    }

    setForm({
      ...form,
      fields: [...form.fields, newField]
    })
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setForm({
      ...form,
      fields: form.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    })
  }

  const removeField = (fieldId: string) => {
    setForm({
      ...form,
      fields: form.fields.filter(field => field.id !== fieldId)
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Form Builder</h1>
          <p className="text-muted-foreground">Create and customize your form</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/forms')}>
            Cancel
          </Button>
          <Button onClick={saveForm} disabled={saving}>
            {saving ? 'Saving...' : 'Save Form'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Field Types Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Field Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => addField('text')}
            >
              Text Input
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => addField('email')}
            >
              Email Input
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => addField('textarea')}
            >
              Textarea
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => addField('select')}
            >
              Select Dropdown
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => addField('radio')}
            >
              Radio Buttons
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => addField('checkbox')}
            >
              Checkbox
            </Button>
          </CardContent>
        </Card>

        {/* Form Builder */}
        <div className="lg:col-span-3 space-y-6">
          {/* Form Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Form Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2 border border-input rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2 border border-input rounded-md"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
            </CardHeader>
            <CardContent>
              {form.fields.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No fields added yet. Start by adding a field from the left panel.
                </p>
              ) : (
                <div className="space-y-4">
                  {form.fields.map((field) => (
                    <div key={field.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Label</label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              className="w-full p-2 border border-input rounded-md"
                            />
                          </div>
                          {(field.type === 'text' || field.type === 'email' || field.type === 'textarea') && (
                            <div>
                              <label className="block text-sm font-medium mb-1">Placeholder</label>
                              <input
                                type="text"
                                value={field.placeholder || ''}
                                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                className="w-full p-2 border border-input rounded-md"
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={field.required || false}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="rounded"
                            />
                            <label className="text-sm">Required field</label>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeField(field.id)}
                          className="ml-4"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
