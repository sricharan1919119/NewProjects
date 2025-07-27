import React, { createContext, useState } from 'react';
import DynamicForm from './DynamicForm';
import './App.css';

// Create Members Context
export const MembersContext = createContext();

// Sample data for demonstration
const sampleMemberData = {
  id: '123',
  emailAddress: [{ type: 'PRIMARY', email: 'user@example.com' }],
  phoneNumbers: [{ type: 'PRIMARY', phoneNumber: '555-0123' }],
  addresses: [
    {
      isPrimary: true,
      isPreferred: false,
      streetAddress1: '123 Main St',
      streetAddress2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001'
    }
  ],
  boats: [
    {
      isPrimary: true,
      boatName: 'Sea Explorer',
      image: 'https://via.placeholder.com/300x200/4dabf7/white?text=Boat'
    }
  ]
};

const sampleFormData = {
  id: 'form-1',
  questions: [
    {
      id: 'q1',
      type: 'text',
      title: 'Full Name',
      ordinal: 1,
      memberProfileLabel: 'fullName',
      isMemberProfileAttribute: true,
      options: [{ id: 'opt1', optionName: 'John Doe' }]
    },
    {
      id: 'q2',
      type: 'text',
      title: 'Email Address',
      ordinal: 2,
      memberProfileLabel: 'emailAddress',
      isMemberProfileAttribute: true,
      options: [{ id: 'opt2', optionName: '' }]
    },
    {
      id: 'q3',
      type: 'text',
      title: 'Address Information',
      ordinal: 3,
      memberProfileLabel: 'addresses',
      options: [{ id: 'opt3', optionName: '' }]
    },
    {
      id: 'q4',
      type: 'radio',
      title: 'Participation Type',
      ordinal: 4,
      options: [
        {
          id: 'opt4a',
          optionName: 'Individual',
          ordinal: 1,
          optionsId: null,
          fieldLogic: {
            formQuestions: [
              {
                id: 'q4a',
                type: 'text',
                title: 'Individual Details',
                ordinal: 1,
                options: [{ id: 'opt4a-1', optionName: '' }]
              }
            ]
          }
        },
        {
          id: 'opt4b',
          optionName: 'Team',
          ordinal: 2,
          optionsId: null,
          fieldLogic: {
            formQuestions: [
              {
                id: 'q4b',
                type: 'text',
                title: 'Team Name',
                ordinal: 1,
                options: [{ id: 'opt4b-1', optionName: '' }]
              },
              {
                id: 'q4c',
                type: 'checkbox',
                title: 'Team Roles',
                ordinal: 2,
                options: [
                  { id: 'opt4c-1', optionName: 'Captain', optionsId: null },
                  { id: 'opt4c-2', optionName: 'Crew Member', optionsId: null },
                  { id: 'opt4c-3', optionName: 'Navigator', optionsId: null }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 'q5',
      type: 'checkbox',
      title: 'Additional Services',
      ordinal: 5,
      options: [
        { id: 'opt5a', optionName: 'Catering', optionsId: null },
        { id: 'opt5b', optionName: 'Photography', optionsId: null },
        { id: 'opt5c', optionName: 'Equipment Rental', optionsId: null }
      ]
    },
    {
      id: 'q6',
      type: 'text',
      title: 'Upload Boat Image',
      ordinal: 6,
      memberProfileLabel: 'boatImage',
      options: [{ id: 'opt6', optionName: '' }]
    },
    {
      id: 'q7',
      type: 'text',
      title: 'Sailing Resume',
      ordinal: 7,
      attributeLabel: 'CREWSRV-Attach your Sailing Resume',
      options: [{ id: 'opt7', optionName: '' }]
    }
  ]
};

// Mock API functions
const getMemberById = async (id, token) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        data: sampleMemberData
      });
    }, 1000);
  });
};

const getFormById = async (formId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        data: sampleFormData
      });
    }, 500);
  });
};

const getUsersCustomAttributes = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        data: [
          { attributeName: 'experience', value: '5 years' },
          { attributeName: 'certification', value: 'ASA 104' }
        ]
      });
    }, 500);
  });
};

const rallyRegistrationFormSubmit = async (payload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Form submitted:', payload);
      resolve({
        status: 200,
        data: { message: 'Form submitted successfully' }
      });
    }, 1000);
  });
};

// Make API functions global for the DynamicForm component
window.getMemberById = getMemberById;
window.getFormById = getFormById;
window.getUsersCustomAttributes = getUsersCustomAttributes;
window.rallyRegistrationFormSubmit = rallyRegistrationFormSubmit;

// Mock navigation object
const mockNavigation = {
  navigate: (route, params) => {
    console.log('Navigate to:', route, params);
    alert(`Would navigate to: ${route}`);
  }
};

function App() {
  const [accessToken] = useState('mock-token-123');
  const [loggedInUser] = useState({ id: '123' });

  // Mock route object
  const mockRoute = {
    params: {
      formId: 'form-1'
    }
  };

  const contextValue = {
    accessToken,
    loggedInUser
  };

  return (
    <MembersContext.Provider value={contextValue}>
      <div className="App">
        <header className="app-header">
          <h1>Dynamic Form Demo</h1>
          <p>This is a React conversion of the React Native dynamic form component</p>
        </header>
        <main>
          <DynamicForm 
            route={mockRoute} 
            navigation={mockNavigation}
          />
        </main>
      </div>
    </MembersContext.Provider>
  );
}

export default App;