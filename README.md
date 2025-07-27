# Dynamic Form React Component

This is a React conversion of a React Native dynamic form component. The component supports nested questions, conditional logic, file uploads, image uploads, and various input types including text, radio buttons, and checkboxes.

## Features

- **Dynamic Form Rendering**: Renders forms based on JSON configuration
- **Nested Questions**: Supports child and nested sub-child questions with conditional logic
- **Multiple Input Types**: Text inputs, radio buttons, checkboxes
- **File Uploads**: Support for document uploads (PDF, DOC)
- **Image Uploads**: Support for image uploads with preview
- **Address Input**: Special handling for address fields
- **Validation**: Built-in form validation with error messages
- **Responsive Design**: Mobile-friendly responsive layout
- **Dark Mode**: Automatic dark mode support
- **Accessibility**: Keyboard navigation and screen reader support

## Files

- `DynamicForm.jsx` - Main form component
- `DynamicForm.css` - Component styles
- `App.jsx` - Demo application with sample data
- `App.css` - Demo application styles

## Usage

### Basic Setup

```jsx
import React, { createContext } from 'react';
import DynamicForm from './DynamicForm';

// Create context for member data
export const MembersContext = createContext();

// Your app component
function App() {
  const contextValue = {
    accessToken: 'your-token',
    loggedInUser: { id: 'user-id' }
  };

  const route = {
    params: { formId: 'your-form-id' }
  };

  const navigation = {
    navigate: (route, params) => {
      // Handle navigation
    }
  };

  return (
    <MembersContext.Provider value={contextValue}>
      <DynamicForm route={route} navigation={navigation} />
    </MembersContext.Provider>
  );
}
```

### Required API Functions

The component expects these functions to be available globally:

```javascript
// Get member data by ID
window.getMemberById = async (id, token) => {
  // Return member data
};

// Get form configuration by ID
window.getFormById = async (formId) => {
  // Return form configuration
};

// Get user's custom attributes
window.getUsersCustomAttributes = async (userId) => {
  // Return custom attributes
};

// Submit form data
window.rallyRegistrationFormSubmit = async (payload) => {
  // Submit form and return response
};
```

### Form Configuration Format

```javascript
const formConfig = {
  id: 'form-id',
  questions: [
    {
      id: 'question-id',
      type: 'text|radio|checkbox',
      title: 'Question Title',
      ordinal: 1,
      memberProfileLabel: 'profileField', // Optional
      attributeLabel: 'customAttribute', // Optional
      isMemberProfileAttribute: true, // Optional
      isCustomAttribute: true, // Optional
      options: [
        {
          id: 'option-id',
          optionName: 'Option Text',
          ordinal: 1,
          optionsId: null, // Set when selected
          fieldLogic: { // Optional nested questions
            formQuestions: [
              // Nested questions array
            ]
          }
        }
      ]
    }
  ]
};
```

### Special Question Types

#### Address Input
```javascript
{
  type: 'text',
  memberProfileLabel: 'addresses',
  // Will render full address form
}
```

#### Image Upload
```javascript
{
  type: 'text',
  memberProfileLabel: 'boatImage' // or 'profileUrl',
  // Will render image upload interface
}
```

#### File Upload
```javascript
{
  type: 'text',
  attributeLabel: 'CREWSRV-Attach your Sailing Resume',
  // Will render file upload interface
}
```

## Component Props

### DynamicForm

| Prop | Type | Description |
|------|------|-------------|
| `route` | Object | Route object with params.formId |
| `navigation` | Object | Navigation object with navigate method |

### RenderInput

| Prop | Type | Description |
|------|------|-------------|
| `dobName` | String | Input label (alternative to name) |
| `name` | String | Input label |
| `placeholder` | String | Input placeholder |
| `value` | String | Input value |
| `onChange` | Function | Change handler |
| `type` | String | Input type (default: 'text') |
| `readOnly` | Boolean | Read-only state |
| `error` | String | Error message |
| `required` | Boolean | Required field indicator |
| `style` | Object | Additional styles |

## Styling

The component uses CSS classes for styling. Key classes:

- `.dynamic-form-container` - Main container
- `.question-block` - Individual question wrapper
- `.child-question` - Child question styling
- `.nested-question` - Nested question styling
- `.form-input` - Input field styling
- `.upload-btn` - Upload button styling
- `.error-text` - Error message styling

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Development

To run the demo:

1. Copy all files to your React project
2. Install dependencies: `npm install react react-dom`
3. Start development server: `npm start`

## Customization

### Styling
Modify `DynamicForm.css` to customize the appearance. The component supports CSS custom properties for theming.

### Validation
Extend the `validateResponses` function to add custom validation rules.

### File Handling
Modify the `pickFile` and `selectImageHandler` functions to integrate with your file upload service.

## Accessibility

The component includes:
- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast support

## License

This component is provided as-is for educational and development purposes.