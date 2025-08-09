import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Form {
  _id: string
  title: string
  description?: string
  fields: any[]
  createdAt: string
  updatedAt: string
}

export default function FormList() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/forms')
      if (response.ok) {
        const data = await response.json()
        setForms(data)
      }
    } catch (error) {
      console.error('Error fetching forms:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteForm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return
    
    try {
      const response = await fetch(`/api/forms/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setForms(forms.filter(form => form._id !== id))
      }
    } catch (error) {
      console.error('Error deleting form:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading forms...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Forms</h1>
          <p className="text-muted-foreground">Manage your created forms</p>
        </div>
        <Button asChild>
          <Link to="/builder">Create New Form</Link>
        </Button>
      </div>

      {forms.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">No forms created yet</p>
            <Button asChild>
              <Link to="/builder">Create Your First Form</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form._id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-1">{form.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {form.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to={`/builder/${form._id}`}>Edit</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/preview/${form._id}`}>Preview</Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteForm(form._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
