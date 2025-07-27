import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import './DynamicForm.css'; // We'll create this CSS file for styling
import { MembersContext } from './App'; // Import the context

const DynamicForm = ({ route, navigation }) => {
  // Context and hooks
  const { accessToken, loggedInUser } = useContext(MembersContext);
  const scrollRef = useRef(null);
  
  // State variables
  const [switchTab, setSwitchTab] = useState(1);
  const [formData, setFormData] = useState(null);
  const [formDataSuccess, setFormDataSuccess] = useState(false);
  const [formOptionError, setFormOptionError] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formsubmitLoader, setFormsubmitLoader] = useState(false);
  const [boatinfoForm, setBoatInfoForm] = useState([]);
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [postalcode, setPostalCode] = useState('');
  const [loader, setLoader] = useState(true);
  const [formloader, setFormLoader] = useState(true);
  const [cardDetails, setCardDetails] = useState();
  const [cardDetailsError, setCardDetailsError] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [summary, setSummary] = useState(null);
  const [doc, setDoc] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [countryErr, setCountryErr] = useState('');
  const [stateErr, setStateErr] = useState('');
  const [address1Err, setAddress1Err] = useState('');
  const [address2Err, setAddress2Err] = useState('');
  const [postalcodeErr, setPostalCodeErr] = useState('');
  const [cityErr, setCityErr] = useState('');
  const [billingLane1, setBillingLane1] = useState('');
  const [billingLane1Error, setBillingLane1Error] = useState('');
  const [billingLane2, setBillingLane2] = useState('');
  const [billingCountry, setBillingCountry] = useState('');
  const [billingCountryError, setBillingCountryError] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingStateError, setBillingStateError] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingCityError, setBillingCityError] = useState('');
  const [billingZipcode, setBillingZipcode] = useState('');
  const [billingZipcodeError, setBillingZipcodeError] = useState('');
  const [paymentFirstName, setPaymentFirstName] = useState('');
  const [paymentFirstNameError, setPaymentFirstNameError] = useState('');
  const [paymentEmail, setPaymentEmail] = useState('');
  const [paymentEmailError, setPaymentEmailError] = useState('');
  const [billingAddressCheck, setBillingAddressCheck] = useState(false);
  const [paymentLastName, setPaymentLastName] = useState('');
  const [paymentLastNameError, setPaymentLastNameError] = useState('');
  const [getMemberData, setGetMemberData] = useState([]);
  const [getMemberDataSuccess, setGetMemberDataSuccess] = useState(false);
  const [customAttributesData, setCustomAttributesData] = useState([]);
  const [customAttributesDataSuceess, setCustomAttributesDataSuccess] = useState(false);
  const [primaryBoat, setPrimaryBoat] = useState('');
  const [primaryBoatDetails, setPrimaryBoatDetails] = useState('');
  const [isImageLodering, setIsImageLodering] = useState(true);

  const getMemberHandler = async () => {
    try {
      setGetMemberDataSuccess(false);
      const response = await window.getMemberById(loggedInUser?.id, accessToken);
      if (response.status === 200) {
        setGetMemberData(response.data);
        // getBoatDetailsHandler(response.data); // Commented out as function not defined
        
        const primaryBoatData = response?.data?.boats?.find(item => item.isPrimary);
        setPrimaryBoat(primaryBoatData?.boatName || '');
        setPrimaryBoatDetails(primaryBoatData);
        setGetMemberDataSuccess(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (route?.params?.formId) {
      const getformData = async () => {
        try {
          const response = await window.getFormById(route?.params?.formId);
          if (response.status === 200) {
            setFormData(response.data);
            setFormDataSuccess(true);
          }
        } catch (error) {
          console.error(error);
        }
      };
      getformData();
    }
  }, [route]);

  // Initialize data loading
  useEffect(() => {
    if (loggedInUser?.id) {
      getMemberHandler();
      getUsersCustomAttributesHandler();
    }
  }, [loggedInUser]);

  const getUsersCustomAttributesHandler = async () => {
    try {
      setLoader(true);
      setCustomAttributesDataSuccess(false);
      const response = await window.getUsersCustomAttributes(loggedInUser.id);
      if (response.status === 200) {
        setCustomAttributesData(response.data);
        setTimeout(() => {
          setLoader(false);
        }, 2000);
        setCustomAttributesDataSuccess(true);
      }
    } catch (error) {
      setCustomAttributesDataSuccess(false);
      setLoader(false);
      console.error(error);
    }
  };

  // Equivalent to useFocusEffect for React
  useEffect(() => {
    if (formDataSuccess && customAttributesDataSuceess && getMemberDataSuccess) {
      const updateOptionsRecursively = (questions) => {
        return questions?.map(question => {
          const matchedInput = customAttributesData.find(attr => question.attributeLabel === attr.attributeName);
          const matchedProfileInput = getMemberData.hasOwnProperty(question.memberProfileLabel);

          // Handle 'addresses'
          if (question.memberProfileLabel === 'addresses') {
            const preferredAddress = getMemberData?.addresses?.find(item => item.isPreferred);
            const primaryAddress = preferredAddress
              ? [preferredAddress]
              : getMemberData?.addresses?.find(item => item.isPrimary);
            if (primaryAddress) {
              setCountry(primaryAddress[0]?.country);
              setState(primaryAddress[0]?.state);
              setCity(primaryAddress[0]?.city);
              setAddress2(primaryAddress[0]?.streetAddress2);
              setAddress1(primaryAddress[0]?.streetAddress1);
              setPostalCode(primaryAddress[0]?.postalCode);
            }
          }

          // Handle 'boats'
          if (question.memberProfileLabel === 'boatName' && question.isMemberProfileAttribute) {
            const boatList = getMemberData?.boats;
            if (boatList && boatList.length > 0) {
              return {
                ...question,
                options: [{
                  ...question.options[0],
                  optionName: boatList[0]?.boatName || ''
                }]
              };
            } else {
              return question;
            }
          }

          // Handle 'phoneNumbers'
          if (question.memberProfileLabel === 'phoneNumbers' && question.isMemberProfileAttribute) {
            const primaryPhone = getMemberData?.phoneNumbers.find(item => item.type === 'PRIMARY');
            return {
              ...question,
              options: [{
                ...question.options[0],
                optionName: primaryPhone?.phoneNumber
              }]
            };
          }

          // Handle 'emailAddress'
          if (question.memberProfileLabel === 'emailAddress' && question.isMemberProfileAttribute) {
            return {
              ...question,
              options: [{
                ...question.options[0],
                optionName: getMemberData.emailAddress.find(item => item.type === 'PRIMARY').email
              }]
            };
          }

          // Handle generic text type for member profile attributes
          if (question.type === 'text' && matchedProfileInput && question.isMemberProfileAttribute) {
            return {
              ...question,
              options: [{
                ...question.options[0],
                optionName: getMemberData[question.memberProfileLabel]
              }]
            };
          }

          // Handle generic text type for custom attributes
          if (question.type === 'text' && matchedInput && question.isCustomAttribute) {
            return {
              ...question,
              options: [{
                ...question.options[0],
                optionName: matchedInput.value
              }]
            };
          }

          if (question.type === 'text' && question.title === "Yacht Name") {
            return {
              ...question,
              options: [{
                ...question.options[0],
                optionName: primaryBoat
              }]
            };
          }

          if (question.type === 'text' && question.memberProfileLabel === "boatImage") {
            const boatList = getMemberData?.boats;
            setIsImageLodering(false);
            return {
              ...question,
              options: [{
                ...question.options[0],
                optionName: boatList[0]?.image || ""
              }]
            };
          }

          if (question.type === 'text' && question.memberProfileLabel === "profileUrl" && matchedProfileInput && question.isMemberProfileAttribute) {
            return {
              ...question,
              options: [{
                ...question.options[0],
                optionName: getMemberData[question.memberProfileLabel] || ""
              }]
            };
          }

          const updatedOptions = question.options?.map(option => {
            if (option.fieldLogic?.formQuestions) {
              return {
                ...option,
                fieldLogic: {
                  ...option.fieldLogic,
                  formQuestions: updateOptionsRecursively(option.fieldLogic.formQuestions)
                }
              };
            }
            return option;
          });

          return { ...question, options: updatedOptions || question.options };
        });
      };

      const updatedQuestions = updateOptionsRecursively(formData?.questions);

      setFormData(prevFormData => ({
        ...prevFormData,
        questions: updatedQuestions
      }));
    }
  }, [customAttributesDataSuceess, formDataSuccess, getMemberDataSuccess, customAttributesData, getMemberData]);

  const handleTextInputChange = (questionToUpdate, optionToUpdate, newValue, setFormOptionError) => {
    setFormOptionError((prevErrors) => ({
      ...prevErrors,
      [questionToUpdate.id]: null,
    }));

    setFormData((prevFormData) => {
      const newFormData = JSON.parse(JSON.stringify(prevFormData));
      const findAndUpdate = (questionsArray) => {
        for (let i = 0; i < questionsArray.length; i++) {
          const question = questionsArray[i];

          if (question.id === questionToUpdate.id) {
            if (question.options && question.options.length > 0) {
              question.options[0].optionName = newValue;
            } else {
              question.options = [{ ...optionToUpdate, optionName: newValue }];
            }
            return true;
          }
          if (question.options) {
            for (const option of question.options) {
              if (option.fieldLogic?.formQuestions) {
                if (findAndUpdate(option.fieldLogic.formQuestions)) {
                  return true;
                }
              }
            }
          }
        }
        return false;
      };
      findAndUpdate(newFormData.questions);
      return newFormData;
    });
  };

  const handleRadioButtonChange = (questionId, selectedOptionId, setFormOptionError, level) => {
    setFormOptionError((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[questionId];
      return updatedErrors;
    });

    setFormData((prev) => {
      const updateQuestionOptions = (question, targetQuestionId, targetSelectedOptionId) => {
        if (question.id === targetQuestionId) {
          return {
            ...question,
            options: question.options.map((opt) => ({
              ...opt,
              optionsId: opt.id === targetSelectedOptionId ? opt.id : null,
            })),
          };
        }
        return question;
      };

      const updatedQuestions = prev.questions.map((q) => {
        // Handle parent level questions
        if (level === 'parent' && q.id === questionId) {
          return updateQuestionOptions(q, questionId, selectedOptionId);
        }

        // Handle child level questions
        const updatedParentOptionsWithChildLogic = q.options.map((parentOpt) => {
          if (parentOpt?.fieldLogic?.formQuestions?.length > 0) {
            const updatedChildQuestions = parentOpt.fieldLogic.formQuestions.map((childQ) => {
              if (level === 'child' && childQ.id === questionId) {
                return updateQuestionOptions(childQ, questionId, selectedOptionId);
              }

              // Handle subChild (nested) level questions
              const updatedChildOptionsWithNestedLogic = childQ.options.map((childOpt) => {
                if (childOpt?.fieldLogic?.formQuestions?.length > 0) {
                  const updatedNestedQuestions = childOpt.fieldLogic.formQuestions.map((nestedQ) => {
                    if (level === 'subChild' && nestedQ.id === questionId) {
                      return updateQuestionOptions(nestedQ, questionId, selectedOptionId);
                    }
                    return nestedQ;
                  });
                  return {
                    ...childOpt,
                    fieldLogic: {
                      ...childOpt.fieldLogic,
                      formQuestions: updatedNestedQuestions,
                    },
                  };
                }
                return childOpt;
              });

              return {
                ...childQ,
                options: updatedChildOptionsWithNestedLogic,
              };
            });

            return {
              ...parentOpt,
              fieldLogic: {
                ...parentOpt.fieldLogic,
                formQuestions: updatedChildQuestions,
              },
            };
          }
          return parentOpt;
        });

        return {
          ...q,
          options: updatedParentOptionsWithChildLogic,
        };
      });

      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const handleCheckBoxChange = (questionId, option, setFormOptionError, level) => {
    setFormOptionError((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[questionId];
      return updatedErrors;
    });

    setFormData((prev) => {
      // Helper function to update a specific question's options
      const toggleOption = (currentQuestion, targetOptionId) => {
        return {
          ...currentQuestion,
          options: currentQuestion.options.map((opt) => {
            if (opt.id === targetOptionId) {
              const isSelected = !!opt.optionsId;
              return {
                ...opt,
                optionsId: isSelected ? null : opt.id, // Toggle selection
              };
            }
            return opt;
          }),
        };
      };

      const updatedQuestions = prev.questions.map((q) => {
        // 1. Handle Parent Level Checkboxes
        if (level === 'parent' && q.id === questionId) {
          return toggleOption(q, option.id);
        }

        // 2. Traverse through Parent's fieldLogic for Child Questions
        if (q.options) {
          const updatedParentOptionsWithChildLogic = q.options.map((parentOpt) => {
            if (parentOpt?.fieldLogic?.formQuestions?.length > 0) {
              const updatedChildQuestions = parentOpt.fieldLogic.formQuestions.map((childQ) => {
                // 3. Handle Child Level Checkboxes
                if (level === 'child' && childQ.id === questionId) {
                  return toggleOption(childQ, option.id);
                }

                // 4. Traverse through Child's fieldLogic for Nested Questions (subChild)
                if (childQ.options) {
                  const updatedChildOptionsWithNestedLogic = childQ.options.map((childOpt) => {
                    if (childOpt?.fieldLogic?.formQuestions?.length > 0) {
                      const updatedNestedQuestions = childOpt.fieldLogic.formQuestions.map((nestedQ) => {
                        // 5. Handle SubChild Level Checkboxes
                        if (level === 'subChild' && nestedQ.id === questionId) {
                          return toggleOption(nestedQ, option.id);
                        }
                        return nestedQ; // Return nestedQ if not the target
                      });
                      return {
                        ...childOpt,
                        fieldLogic: {
                          ...childOpt.fieldLogic,
                          formQuestions: updatedNestedQuestions,
                        },
                      };
                    }
                    return childOpt; // Return childOpt if no nested logic
                  });
                  return {
                    ...childQ,
                    options: updatedChildOptionsWithNestedLogic,
                  };
                }
                return childQ; // Return childQ if no options or fieldLogic
              });
              return {
                ...parentOpt,
                fieldLogic: {
                  ...parentOpt.fieldLogic,
                  formQuestions: updatedChildQuestions,
                },
              };
            }
            return parentOpt; // Return parentOpt if no fieldLogic
          });
          return {
            ...q,
            options: updatedParentOptionsWithChildLogic,
          };
        }
        return q; // Return q if no options or fieldLogic
      });

      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const validateResponses = (questions = []) => {
    let isValid = true;
    const errors = {};

    const traverse = (questionList) => {
      for (const question of questionList) {
        const isTrackingUpdateNotice = question.title?.includes("https/");
        const isBoatImageUpload = question.memberProfileLabel === "boatImage";
        const isResumeUpload = question.attributeLabel === "CREWSRV-Attach your Sailing Resume";
        const isAddressQuestion = question.memberProfileLabel === "addresses";
        const skipGeneralRequiredValidation = isTrackingUpdateNotice || isBoatImageUpload || isResumeUpload || isAddressQuestion;

        if (question.type === "text") {
          if (!skipGeneralRequiredValidation) {
            const value = question.options?.[0]?.optionName || "";
            if (!value.trim()) {
              isValid = false;
              errors[question.id] = "Required";
            }
          }
          if (isAddressQuestion) {
            if (address1 === '' || !address1) {
              setAddress1Err('Required');
              isValid = false;
            }
            if (country === '' || !country) {
              setCountryErr('Required');
              isValid = false;
            }
            if (state === '' || !state) {
              setStateErr('Required');
              isValid = false;
            }
            if (city === '' || !city) {
              setCityErr('Required');
              isValid = false;
            }
          }
          if (isBoatImageUpload) {
            if (!selectedImage) { // Check if image is present
              isValid = false;
              errors[question.id] = "Required";
            }
          }
          if (isResumeUpload) {
            if (!doc || doc.length === 0) { // Check if any document is uploaded
              isValid = false;
              errors[question.id] = "Required";
            }
          }
        } else if (question.type === "radio") {
          const selectedOption = question.options?.find((opt) => opt.optionsId);
          if (!selectedOption) {
            isValid = false;
            errors[question.id] = "Required";
          } else {
            if (selectedOption.fieldLogic?.formQuestions?.length > 0) {
              traverse(selectedOption.fieldLogic.formQuestions);
            }
          }
        } else if (question.type === "checkbox") {
          const selectedOptions = question.options?.filter((opt) => opt.optionsId);
          if (!selectedOptions || selectedOptions.length === 0) {
            isValid = false;
            errors[question.id] = "Required";
          } else {
            selectedOptions.forEach((opt) => {
              if (opt.fieldLogic?.formQuestions?.length > 0) {
                traverse(opt.fieldLogic.formQuestions);
              }
            });
          }
        }
      }
    };

    traverse(questions);
    return { isValid, errors };
  };

  const extractResponses = (questions = []) => {
    const responses = [];

    const traverse = (questionList) => {
      questionList.forEach((question) => {
        const isResumeUpload = question.attributeLabel === "CREWSRV-Attach your Sailing Resume";
        const isBoatImageUpload = question.memberProfileLabel === "boatImage";
        const profileImg = question.memberProfileLabel === "profileurl";
        const isAddressInput = question.memberProfileLabel === "addresses";

        if (question.type === "text") {
          if (isBoatImageUpload && selectedImage?.length > 0) {
            const boatImageUrl = selectedImage[0];
            responses.push({
              questionId: question.id,
              inputText: boatImageUrl,
              optionId: null,
            });
          } else if (isResumeUpload && doc?.length > 0) {
            const resumeUrls = doc.map(d => d.url).join(",");
            responses.push({
              questionId: question.id,
              inputText: resumeUrls,
              optionId: null,
            });
          } else if (isAddressInput) {
            responses.push({
              questionId: question.id,
              inputText: `${address1}${address2 ? ',' + address2 : ''}${city ? ',' + city : ''}${state ? ',' + state : ''}${country ? ',' + country : ''}${postalcode ? ',' + postalcode : ''}`,
              optionId: null,
            });
          } else {
            // Default text input
            const value = question.options?.[0]?.optionName || "";
            if (value) {
              responses.push({
                questionId: question.id,
                inputText: value,
                optionId: null,
              });
            }
          }
        } else if (question.type === "radio") {
          const selectedOption = question.options?.find((opt) => opt.optionsId);
          if (selectedOption) {
            responses.push({
              questionId: question.id,
              inputText: null,
              optionId: selectedOption.id,
            });

            // Recursively handle children
            if (selectedOption.fieldLogic?.formQuestions?.length > 0) {
              traverse(selectedOption.fieldLogic.formQuestions);
            }
          }
        } else if (question.type === "checkbox") {
          const selectedOptions = question.options?.filter((opt) => opt.optionsId);
          if (selectedOptions?.length > 0) {
            responses.push({
              questionId: question.id,
              inputText: "",
              optionId: selectedOptions.map((o) => o.id).join(","), // multiple values
            });

            // Recursively handle each selected checkbox's children
            selectedOptions.forEach((opt) => {
              if (opt.fieldLogic?.formQuestions?.length > 0) {
                traverse(opt.fieldLogic.formQuestions);
              }
            });
          }
        }
      });
    };

    traverse(questions);
    return responses;
  };

  const submitRallyRegistrationHandler = async () => {
    setErrorMsg("");
    const { isValid, errors } = validateResponses(formData.questions);
    setFormOptionError(errors); // set errors for rendering
    if (!isValid) {
      setErrorMsg("Please submit all mandatory fields.");
      return; // no alert
    }
    const payload = {
      id: formData?.id || "",
      userResponseOptions: extractResponses(formData.questions),
    };
    try {
      setFormsubmitLoader(true);
      const response = await window.rallyRegistrationFormSubmit(payload);
      if (response.status === 200) {
        setErrorMsg("");
        setShowSuccessModal(true);
        setFormsubmitLoader(false);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.navigate('Rallies', { refresh: true });
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error?.errorResponse || 'An error occurred');
      setFormsubmitLoader(false);
    }
  };

  // File selection handlers for web
  const pickFile = (question) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.doc,.docx,.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const newDoc = {
          fileName: file.name,
          url: URL.createObjectURL(file),
          file: file
        };
        setDoc(prev => [...prev, newDoc]);
      }
    };
    input.click();
  };

  const selectImageHandler = (question) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage([imageUrl]);
        handleTextInputChange(question, question.options?.[0] || {}, imageUrl, setFormOptionError);
      }
    };
    input.click();
  };

  const removeDocument = (index) => {
    setDoc(prev => prev.filter((_, i) => i !== index));
  };

  const sliceString = (str, length) => {
    return str.length > length ? str.slice(0, length) + '...' : str;
  };

  const formatMessageLinks = (text) => {
    // Simple link formatting - you might want to enhance this
    if (text?.includes('http')) {
      const parts = text.split(/(https?:\/\/[^\s]+)/g);
      return parts.map((part, index) => 
        part.startsWith('http') ? 
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a> : 
          part
      );
    }
    return text;
  };

  return (
    <div className="dynamic-form-container" ref={scrollRef}>
      {formData && formData?.questions?.length > 0 ? (
        formData?.questions
          ?.sort((a, b) => a.ordinal - b.ordinal)
          ?.map((question) => {
            const selectedParentOptions = question.options?.filter((opt) => opt.optionsId) || [];
            const childQuestions = selectedParentOptions.flatMap(
              (opt) => opt.fieldLogic?.formQuestions || []
            );

            return (
              <div key={question.id} className="question-block">
                {question.type !== 'text' && (
                  <div>
                    <label className="question-title">
                      {question.title}<span className="required">*</span>
                    </label>
                  </div>
                )}

                {/* Parent Text Input */}
                {question.type === 'text' &&
                question?.memberProfileLabel !== 'addresses' && 
                question.memberProfileLabel !== "boatImage" &&
                question.memberProfileLabel !== "profileUrl" &&
                !question.title?.includes("https/") && (
                  <RenderInput
                    dobName={question.title}
                    placeholder={`Enter ${question.title}`}
                    value={question.options?.[0]?.optionName || ''}
                    onChange={(e) =>
                      handleTextInputChange(
                        question,
                        question.options?.[0]?.optionName || {},
                        e.target.value,
                        setFormOptionError
                      )
                    }
                    type={
                      question.title.toLowerCase().includes('phone')
                        ? 'tel'
                        : 'text'
                    }
                    readOnly={
                      question?.memberProfileLabel === 'username' ||
                      question?.memberProfileLabel === 'emailAddress'
                    }
                    error={formOptionError[question.id]}
                    required={true}
                  />
                )}

                {/* Address Input */}
                {question?.memberProfileLabel === 'addresses' && (
                  <div className="address-section">
                    <RenderInput
                      name={'Street Address 1'}
                      placeholder={'Enter Street Address 1'}
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      error={address1Err}
                      required={true}
                    />
                    <RenderInput
                      name={'Street Address 2'}
                      placeholder={'Enter Street Address 2'}
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      error={address2Err}
                    />
                    <div className="row">
                      <RenderInput
                        name={'Country'}
                        placeholder={'Enter Country'}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        error={countryErr}
                        required={true}
                        style={{ width: "48%" }}
                      />
                      <RenderInput
                        name={'State'}
                        placeholder={'Enter State'}
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        error={stateErr}
                        required={true}
                        style={{ width: "48%" }}
                      />
                    </div>
                    <div className="row">
                      <RenderInput
                        name={'City'}
                        placeholder={'Enter City'}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        error={cityErr}
                        required={true}
                        style={{ width: "48%" }}
                      />
                      <RenderInput
                        name={'Zip/Postal Code'}
                        placeholder={'Enter Zip/Postal Code'}
                        value={postalcode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        error={postalcodeErr}
                        required={false}
                        type={'text'}
                        style={{ width: "48%" }}
                      />
                    </div>
                  </div>
                )}

                {/* Resume Upload */}
                {question.attributeLabel === "CREWSRV-Attach your Sailing Resume" && question.type === "text" && (
                  <div className="file-upload-section">
                    <label className="question-title">
                      {question.title} <span className="required">*</span>
                    </label>
                    <button
                      onClick={() => pickFile(question)}
                      className="upload-btn"
                      type="button"
                    >
                      {loader ? (
                        <div className="loader">Loading...</div>
                      ) : (
                        <div className="upload-content">
                          <span className="upload-icon">📤</span>
                          <span>Upload Resume (.doc,.pdf)</span>
                        </div>
                      )}
                    </button>
                    <div className="uploaded-files">
                      {doc && doc.length > 0 &&
                        doc.map((document, index) => (
                          <div key={index} className="uploaded-file">
                            <span>{sliceString(document.fileName, 15)}</span>
                            <button 
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="remove-btn"
                            >
                              🗑️
                            </button>
                          </div>
                        ))
                      }
                    </div>
                    {formOptionError[question.id] && (
                      <div className="error-text">{formOptionError[question.id]}</div>
                    )}
                  </div>
                )}

                {/* Image Upload */}
                {(question.memberProfileLabel === "boatImage" || question.memberProfileLabel === "profileUrl") && (
                  <div className="image-upload-section">
                    <label className="question-title">
                      {question.title} <span className="required">*</span>
                    </label>
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() => selectImageHandler(question)}
                    >
                      <span className="upload-icon">📤</span>
                      <span>Upload Image</span>
                    </button>
                    {question.options?.[0]?.optionName && (
                      <div className="uploaded-image">
                        <img 
                          src={question.options?.[0]?.optionName} 
                          alt="Uploaded" 
                          className="preview-image"
                        />
                        {isImageLodering && (
                          <div className="image-loader">Loading...</div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            handleTextInputChange(question, question.options?.[0] || {}, '', setFormOptionError);
                          }}
                          className="close-btn"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {formOptionError[question.id] && (
                      <div className="error-text">{formOptionError[question.id]}</div>
                    )}
                  </div>
                )}

                {/* Link Display */}
                {question.type === 'text' && question.title?.includes("https/") && (
                  <div className="link-display">
                    {formatMessageLinks(question.title)}
                  </div>
                )}

                {/* Parent Options (Radio/Checkbox) */}
                {question.type !== 'text' &&
                  question.options
                    ?.sort((a, b) => a.ordinal - b.ordinal)
                    ?.map((option) => (
                      <div key={option.id} className="option-block">
                        {question.type === 'checkbox' && (
                          <>
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={!!option.optionsId || option.participant}
                                disabled={option.participant === true}
                                onChange={() =>
                                  handleCheckBoxChange(
                                    question.id,
                                    option,
                                    setFormOptionError,
                                    'parent'
                                  )
                                }
                              />
                              <span>{option.optionName}</span>
                            </label>
                            {question.options?.[question.options.length - 1]?.id === option.id &&
                              formOptionError[question.id] && (
                                <div className="error-text">{formOptionError[question.id]}</div>
                              )}
                          </>
                        )}

                        {question.type === 'radio' && (
                          <>
                            <label className="radio-label">
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option.id}
                                checked={question.options.find((opt) => opt.optionsId)?.id === option.id}
                                onChange={() =>
                                  handleRadioButtonChange(
                                    question.id,
                                    option.id,
                                    setFormOptionError,
                                    'parent'
                                  )
                                }
                              />
                              <span>{formatMessageLinks(option.optionName)}</span>
                            </label>
                            {question.options?.[question.options.length - 1]?.id === option.id && 
                              formOptionError[question.id] && (
                                <div className="error-text">{formOptionError[question.id]}</div>
                              )}
                          </>
                        )}
                      </div>
                    ))}

                {/* Child Questions */}
                {childQuestions.map((childQuestion) => {
                  const selectedChildOptions =
                    childQuestion.options?.filter((opt) => opt.optionsId) || [];
                  const nestedQuestions = selectedChildOptions.flatMap(
                    (opt) => opt.fieldLogic?.formQuestions || []
                  );

                  return (
                    <div key={childQuestion.id} className="child-question">
                      <label className="question-title">
                        {childQuestion.title}<span className="required">*</span>
                      </label>

                      {/* Child Text Input */}
                      {childQuestion.type === 'text' && 
                      childQuestion?.memberProfileLabel !== 'addresses' &&
                      childQuestion.memberProfileLabel !== "boatImage" && 
                      childQuestion.memberProfileLabel !== "profileUrl" && (
                        <RenderInput
                          placeholder={`Enter ${childQuestion?.title}`}
                          value={childQuestion.options?.[0]?.optionName || ''}
                          onChange={(e) =>
                            handleTextInputChange(
                              childQuestion,
                              childQuestion.options?.[0] || {},
                              e.target.value,
                              setFormOptionError
                            )
                          }
                          type={
                            childQuestion?.title?.toLowerCase()?.includes('phone')
                              ? 'tel'
                              : 'text'
                          }
                          error={formOptionError[childQuestion.id]}
                          required={true}
                        />
                      )}

                      {/* Child Image Uploads */}
                      {(childQuestion.memberProfileLabel === "profileUrl" || childQuestion.memberProfileLabel === "boatImage") && (
                        <div className="image-upload-section">
                          <button
                            type="button"
                            className="upload-btn"
                            onClick={() => selectImageHandler(childQuestion)}
                          >
                            <span className="upload-icon">📤</span>
                            <span>Upload {childQuestion.memberProfileLabel === "profileUrl" ? "Profile" : "Boat"} Image</span>
                          </button>
                          {childQuestion.options?.[0]?.optionName && (
                            <div className="uploaded-image">
                              <img 
                                src={childQuestion.options?.[0]?.optionName} 
                                alt="Uploaded" 
                                className="preview-image"
                              />
                              {isImageLodering && (
                                <div className="image-loader">Loading...</div>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  handleTextInputChange(childQuestion, childQuestion.options?.[0] || {}, '', setFormOptionError);
                                }}
                                className="close-btn"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                          {formOptionError[childQuestion.id] && (
                            <div className="error-text">{formOptionError[childQuestion.id]}</div>
                          )}
                        </div>
                      )}

                      {/* Child Address Input - similar structure as parent */}
                      {childQuestion?.memberProfileLabel === 'addresses' && (
                        <div className="address-section">
                          <RenderInput
                            name={'Street Address 1'}
                            placeholder={'Enter Street Address 1'}
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                            error={address1Err}
                            required={true}
                          />
                          <RenderInput
                            name={'Street Address 2'}
                            placeholder={'Enter Street Address 2'}
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            error={address2Err}
                          />
                          <div className="row">
                            <RenderInput
                              name={'Country'}
                              placeholder={'Enter Country'}
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              error={countryErr}
                              required={true}
                              style={{ width: "48%" }}
                            />
                            <RenderInput
                              name={'State'}
                              placeholder={'Enter State'}
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              error={stateErr}
                              required={true}
                              style={{ width: "48%" }}
                            />
                          </div>
                          <div className="row">
                            <RenderInput
                              name={'City'}
                              placeholder={'Enter City'}
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              error={cityErr}
                              required={true}
                              style={{ width: "48%" }}
                            />
                            <RenderInput
                              name={'Zip/Postal Code'}
                              placeholder={'Enter Zip/Postal Code'}
                              value={postalcode}
                              onChange={(e) => setPostalCode(e.target.value)}
                              error={postalcodeErr}
                              required={false}
                              type={'text'}
                              style={{ width: "48%" }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Child Options (Radio/Checkbox) */}
                      {childQuestion.type !== 'text' &&
                        childQuestion.options?.map((childOption) => (
                          <div key={childOption.id} className="option-block">
                            {childQuestion.type === 'checkbox' && (
                              <>
                                <label className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={!!childOption.optionsId || childOption.participant}
                                    disabled={childOption.participant === true}
                                    onChange={() =>
                                      handleCheckBoxChange(
                                        childQuestion.id,
                                        childOption,
                                        setFormOptionError,
                                        'child'
                                      )
                                    }
                                  />
                                  <span>{childOption.optionName}</span>
                                </label>
                                {childQuestion.options?.[childQuestion.options.length - 1]?.id === childOption.id &&
                                  formOptionError[childQuestion.id] && (
                                    <div className="error-text">{formOptionError[childQuestion.id]}</div>
                                  )}
                              </>
                            )}

                            {childQuestion.type === 'radio' && (
                              <>
                                <label className="radio-label">
                                  <input
                                    type="radio"
                                    name={`child-question-${childQuestion.id}`}
                                    value={childOption.id}
                                    checked={childQuestion.options.find((opt) => opt.optionsId)?.id === childOption.id}
                                    onChange={() =>
                                      handleRadioButtonChange(
                                        childQuestion.id,
                                        childOption.id,
                                        setFormOptionError,
                                        'child'
                                      )
                                    }
                                  />
                                  <span>{childOption.optionName}</span>
                                </label>
                                {childQuestion.options?.[childQuestion.options.length - 1]?.id === childOption.id && 
                                  formOptionError[childQuestion.id] && (
                                    <div className="error-text">{formOptionError[childQuestion.id]}</div>
                                  )}
                              </>
                            )}
                          </div>
                        ))}

                      {/* Nested Questions */}
                      {nestedQuestions.map((nestedQuestion) => (
                        <div key={nestedQuestion.id} className="nested-question">
                          {nestedQuestion.type === 'radio' && (
                            <div>
                              <label className="question-title">
                                {nestedQuestion.title}
                                <span className="required">*</span>
                              </label>
                            </div>
                          )}

                          {/* Nested Text Input */}
                          {nestedQuestion.type === 'text' && 
                          nestedQuestion?.memberProfileLabel !== 'addresses' &&
                          nestedQuestion.memberProfileLabel !== "boatImage" && 
                          nestedQuestion.memberProfileLabel !== "profileUrl" && (
                            <RenderInput
                              placeholder={`Enter ${nestedQuestion?.title}`}
                              value={nestedQuestion.options?.[0]?.optionName || ''}
                              onChange={(e) =>
                                handleTextInputChange(
                                  nestedQuestion,
                                  nestedQuestion.options?.[0] || {},
                                  e.target.value,
                                  setFormOptionError
                                )
                              }
                              type={
                                nestedQuestion?.title?.toLowerCase()?.includes('phone')
                                  ? 'tel'
                                  : 'text'
                              }
                              error={formOptionError[nestedQuestion.id]}
                              required={true}
                            />
                          )}

                          {/* Nested Image Uploads */}
                          {(nestedQuestion.memberProfileLabel === "profileUrl" || nestedQuestion.memberProfileLabel === "boatImage") && (
                            <div className="image-upload-section">
                              <button
                                type="button"
                                className="upload-btn"
                                onClick={() => selectImageHandler(nestedQuestion)}
                              >
                                <span className="upload-icon">📤</span>
                                <span>Upload {nestedQuestion.memberProfileLabel === "profileUrl" ? "Profile" : "Boat"} Image</span>
                              </button>
                              {nestedQuestion.options?.[0]?.optionName && (
                                <div className="uploaded-image">
                                  <img 
                                    src={nestedQuestion.options?.[0]?.optionName} 
                                    alt="Uploaded" 
                                    className="preview-image"
                                  />
                                  {isImageLodering && (
                                    <div className="image-loader">Loading...</div>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleTextInputChange(nestedQuestion, nestedQuestion.options?.[0] || {}, '', setFormOptionError);
                                    }}
                                    className="close-btn"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                              {formOptionError[nestedQuestion.id] && (
                                <div className="error-text">{formOptionError[nestedQuestion.id]}</div>
                              )}
                            </div>
                          )}

                          {/* Nested Address Input */}
                          {nestedQuestion?.memberProfileLabel === 'addresses' && (
                            <div className="address-section">
                              <RenderInput
                                name={'Street Address 1'}
                                placeholder={'Enter Street Address 1'}
                                value={address1}
                                onChange={(e) => setAddress1(e.target.value)}
                                error={address1Err}
                                required={true}
                              />
                              <RenderInput
                                name={'Street Address 2'}
                                placeholder={'Enter Street Address 2'}
                                value={address2}
                                onChange={(e) => setAddress2(e.target.value)}
                                error={address2Err}
                              />
                              <div className="row">
                                <RenderInput
                                  name={'Country'}
                                  placeholder={'Enter Country'}
                                  value={country}
                                  onChange={(e) => setCountry(e.target.value)}
                                  error={countryErr}
                                  required={true}
                                  style={{ width: "48%" }}
                                />
                                <RenderInput
                                  name={'State'}
                                  placeholder={'Enter State'}
                                  value={state}
                                  onChange={(e) => setState(e.target.value)}
                                  error={stateErr}
                                  required={true}
                                  style={{ width: "48%" }}
                                />
                              </div>
                              <div className="row">
                                <RenderInput
                                  name={'City'}
                                  placeholder={'Enter City'}
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  error={cityErr}
                                  required={true}
                                  style={{ width: "48%" }}
                                />
                                <RenderInput
                                  name={'Zip/Postal Code'}
                                  placeholder={'Enter Zip/Postal Code'}
                                  value={postalcode}
                                  onChange={(e) => setPostalCode(e.target.value)}
                                  error={postalcodeErr}
                                  required={false}
                                  type={'text'}
                                  style={{ width: "48%" }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Nested Options (Radio/Checkbox) */}
                          {nestedQuestion.type !== 'text' && (
                            <>
                              {nestedQuestion.options?.map((nestedOption) => (
                                <div key={nestedOption.id} className="option-block">
                                  {nestedQuestion.type === 'checkbox' && (
                                    <>
                                      <label className="checkbox-label">
                                        <input
                                          type="checkbox"
                                          checked={!!nestedOption.optionsId || nestedOption.participant}
                                          disabled={nestedOption.participant === true}
                                          onChange={() =>
                                            handleCheckBoxChange(
                                              nestedQuestion.id,
                                              nestedOption,
                                              setFormOptionError,
                                              'subChild'
                                            )
                                          }
                                        />
                                        <span>{nestedOption.optionName}</span>
                                      </label>
                                      {nestedQuestion.options?.[nestedQuestion.options.length - 1]?.id === nestedOption.id &&
                                        formOptionError[nestedQuestion.id] && (
                                          <div className="error-text">{formOptionError[nestedQuestion.id]}</div>
                                        )}
                                    </>
                                  )}
                                  {nestedQuestion.type === 'radio' && (
                                    <label className="radio-label">
                                      <input
                                        type="radio"
                                        name={`nested-question-${nestedQuestion.id}`}
                                        value={nestedOption.id}
                                        checked={nestedQuestion.options.find((opt) => opt.optionsId)?.id === nestedOption.id}
                                        onChange={() =>
                                          handleRadioButtonChange(
                                            nestedQuestion.id,
                                            nestedOption.id,
                                            setFormOptionError,
                                            'subChild'
                                          )
                                        }
                                      />
                                      <span>{nestedOption.optionName}</span>
                                    </label>
                                  )}
                                </div>
                              ))}
                              {nestedQuestion.type === 'radio' && formOptionError[nestedQuestion.id] && (
                                <div className="error-text">{formOptionError[nestedQuestion.id]}</div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })
      ) : (
        <NoDataFound message={infoMsg || 'No Form Found'} />
      )}
      {errorMsg && <div className="error-message">{errorMsg}</div>}
      
      <button 
        onClick={submitRallyRegistrationHandler}
        disabled={formsubmitLoader}
        className="submit-btn"
      >
        {formsubmitLoader ? 'Submitting...' : 'Submit Form'}
      </button>
    </div>
  );
};

// RenderInput component for React
const RenderInput = ({ 
  dobName, 
  name, 
  placeholder, 
  value, 
  onChange, 
  type = 'text', 
  readOnly = false, 
  error, 
  required = false, 
  style = {} 
}) => {
  return (
    <div className="input-group" style={style}>
      {(dobName || name) && (
        <label className="input-label">
          {dobName || name}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`form-input ${error ? 'error' : ''}`}
      />
      {error && <div className="error-text">{error}</div>}
    </div>
  );
};

// NoDataFound component
const NoDataFound = ({ message }) => {
  return (
    <div className="no-data-found">
      <p>{message}</p>
    </div>
  );
};

export default DynamicForm;