# FormCraft 🚀

**A modern, full-stack form builder with advanced question types for educational assessments and surveys.**

Built with React, TypeScript, Express, and MongoDB - featuring drag-and-drop categorization, fill-in-the-blank cloze tests, and reading comprehension questions.

![FormCraft Preview](https://6896d95150b50d000853a616--melodic-kelpie-ab6f3c.netlify.app/)

## ✨ Features

### 🎯 **Advanced Question Types**

- **Categorize**: Drag-and-drop items into categories with visual feedback
- **Cloze**: Fill-in-the-blank questions with dynamic text parsing
- **Comprehension**: Reading passages with multiple question formats (text, multiple choice, true/false)

### 🛠️ **Builder Features**

- **Visual Form Builder**: Intuitive drag-and-drop interface
- **Real-time Preview**: See questions as you build them
- **Image Support**: Upload images for forms and individual questions
- **Form Management**: Create, edit, delete, and organize forms
- **Response Tracking**: Collect and analyze form submissions

### 🎨 **Modern UI/UX**

- **Responsive Design**: Works perfectly on all screen sizes
- **Beautiful Interface**: Clean, professional design with smooth animations
- **Dark/Light Theme**: Adaptive styling with gradient backgrounds
- **Accessibility**: Keyboard navigation and screen reader support

## 🏗️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS 3** for styling
- **Radix UI** + **shadcn/ui** for components
- **React Router 6** for navigation
- **Lucide React** for icons

### Backend

- **Express.js** with TypeScript
- **MongoDB** with Mongoose ODM
- **CORS** enabled for cross-origin requests
- **File upload** support for images

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (optional - falls back to in-memory storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd formcraft
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)

   ```bash
   # For MongoDB connection (optional)
   export MONGODB_URI="mongodb://localhost:27017/formcraft"
   # or for MongoDB Atlas
   export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/formcraft"
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 📖 Usage

### Creating Forms

1. **Start Building**: Click "Create Form" from the homepage
2. **Form Settings**: Add title, description, and optional header image
3. **Add Questions**: Choose from three question types:
   - **Categorize**: Create categories and items to be sorted
   - **Cloze**: Write text with `[blanks]` for users to fill
   - **Comprehension**: Add reading passages with follow-up questions
4. **Save & Preview**: Save your form and preview how users will see it

### Question Types Guide

#### 🏷️ Categorize Questions

```
Categories: Animals, Plants, Minerals
Items: Dog, Rose, Diamond, Cat, Oak, Gold
```

Users drag items into the correct categories.

#### ✏️ Cloze Questions

```
Text: "The [capital] of France is [Paris]."
```

Users fill in the blanks with correct answers.

#### 📚 Comprehension Questions

```
Passage: "Your reading text here..."
Questions:
- What is the main idea? (Text answer)
- The author suggests... (Multiple choice)
- True or False: The passage mentions... (True/False)
```

### Taking Forms

1. **Access Form**: Use the preview link or form ID
2. **Complete Questions**: Answer all questions in the form
3. **Submit**: Click "Submit Form" to save responses
4. **Confirmation**: Receive submission confirmation

## 🗄️ Database Schema

### Forms Collection

```javascript
{
  title: String,
  description: String,
  headerImage: String (base64),
  questions: [{
    id: String,
    type: 'categorize' | 'cloze' | 'comprehension',
    title: String,
    image: String (base64),
    data: Object // Question-specific data
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Responses Collection

```javascript
{
  formId: ObjectId,
  answers: [{
    questionId: String,
    type: String,
    data: Object // Answer data
  }],
  submittedAt: Date,
  ipAddress: String,
  userAgent: String
}
```

## 🔧 API Endpoints

### Forms

- `GET /api/forms` - List all forms
- `GET /api/forms/:id` - Get specific form
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

### Responses

- `POST /api/responses` - Submit form response
- `GET /api/responses` - List all responses (paginated)
- `GET /api/responses/form/:formId` - Get responses for specific form
- `GET /api/responses/:id` - Get specific response
- `DELETE /api/responses/:id` - Delete response

## 🛠️ Development

### Project Structure

```
├── client/                 # React frontend
│   ├── components/ui/      # Reusable UI components
│   ├── components/questions/ # Question type components
│   ├── pages/             # Route components
│   ├── services/          # API service layer
│   └── main.tsx           # App entry point
├── server/                # Express backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API route handlers
│   ├── storage/          # Fallback storage for development
│   └── index.ts          # Server entry point
└── shared/               # Shared TypeScript types
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # Run TypeScript checks
npm test            # Run tests
```

### Building for Production

```bash
npm run build
npm run start
```

## 🚀 Deployment

### Environment Variables

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/formcraft
PORT=8080
NODE_ENV=production
```

### Deploy to Cloud Platforms

#### Netlify/Vercel

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in platform settings

#### Railway/Render

1. Connect repository
2. Set start command: `npm start`
3. Add environment variables
4. Deploy

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit: `git commit -m "Add feature-name"`
6. Push: `git push origin feature-name`
7. Submit a pull request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Report bugs via GitHub Issues
- **Questions**: Open a discussion in GitHub Discussions

## 🎯 Roadmap

- [ ] **Real-time Collaboration**: Multiple users editing forms simultaneously
- [ ] **Templates**: Pre-built form templates for common use cases
- [ ] **Analytics Dashboard**: Detailed response analytics and insights
- [ ] **Export Options**: PDF, CSV, and Excel export for responses
- [ ] **Advanced Question Types**: Matrix, ranking, and file upload questions
- [ ] **Theme Customization**: Custom branding and color schemes
- [ ] **API Webhooks**: Real-time notifications for form submissions

---

**Built with ❤️ for educators, researchers, and survey creators.**

_FormCraft makes creating sophisticated assessments as easy as building with blocks._
