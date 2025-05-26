'use client'

import { useState, useEffect } from "react";
import FormInfoBox from "./FormInfoBox";
import LogoCoverUploader from "./LogoCoverUploader";

const Index = () => {
    const [companyProfileData, setCompanyProfileData] = useState({
        formData: {},
        logoFile: null,
        coverFile: null,
    });

    const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
    const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [isEditing, setIsEditing] = useState(false); // Add state for editing mode
    const [initialProfileData, setInitialProfileData] = useState(null); // Store initial fetched data
    const [showNotification, setShowNotification] = useState(false); // State for temporary notification
    const [notificationMessage, setNotificationMessage] = useState(""); // State for notification message

    // Fetch company profile data on component mount
    useEffect(() => {
        const fetchCompanyProfile = async () => {
            setIsLoading(true);
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error("User ID not found in localStorage.");
                setIsLoading(false);
                return;
            }

            try {
                // Assuming the GET endpoint is /api/CompanyProfile/{userId}
                const response = await fetch(`/api/CompanyProfile/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched company profile data:", data);
                    // Update state with fetched data
                    setInitialProfileData(data); // Store fetched data
                    setCompanyProfileData(prevState => ({
                        ...prevState,
                        formData: {
                            companyName: data.companyName || "",
                            phone: data.contact || "", // API uses Contact
                            website: data.website || "",
                            teamSize: data.teamSize || "50 - 100",
                            location: data.location || "",
                            industryId: data.industryId || "",
                            aboutCompany: data.companyProfileDescription || "", // API uses CompanyProfileDescription
                        },
                        // We don't set logoFile/coverFile here as they are File objects not URLs
                        // The URLs for existing images will be passed separately if the API provides them
                    }));
                    // Assuming API response includes URLs for existing logo/cover
                    if (data.urlCompanyLogo) setLogoPreviewUrl(data.urlCompanyLogo);
                    if (data.imageLogoLgr) setCoverPreviewUrl(data.imageLogoLgr); // Use imageLogoLgr for cover

                } else if (response.status === 404) {
                    console.log("No existing company profile found.");
                    // Keep default state if no profile exists
                } else {
                    console.error('Failed to fetch company profile:', response.status);
                    // Handle other errors
                }
            } catch (error) {
                console.error('Error fetching company profile:', error);
                // Handle network errors
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyProfile();
    }, []); // Empty dependency array means this effect runs once on mount

    const handleFormChange = (data) => {
        setCompanyProfileData(prevState => ({
            ...prevState,
            formData: data,
        }));
        // Clear validation error for this field if it exists
        if (validationErrors[Object.keys(data)[0]]) {
             setValidationErrors(prevErrors => {
                 const newErrors = { ...prevErrors };
                 delete newErrors[Object.keys(data)[0]];
                 return newErrors;
             });
         }
    };

    const handleLogoChange = (file) => {
        setCompanyProfileData(prevState => ({
            ...prevState,
            logoFile: file,
        }));
        // Create preview URL for logo
        if (file) {
            setLogoPreviewUrl(URL.createObjectURL(file));
             // Clear validation error for logoFile
             if (validationErrors.logoFile) {
                 setValidationErrors(prevErrors => {
                     const newErrors = { ...prevErrors };
                     delete newErrors.logoFile;
                     return newErrors;
                 });
             }
        } else {
            setLogoPreviewUrl(null);
        }
    };

    const handleCoverChange = (file) => {
        setCompanyProfileData(prevState => ({
            ...prevState,
            coverFile: file,
        }));
         // Create preview URL for cover
        if (file) {
            setCoverPreviewUrl(URL.createObjectURL(file));
             // Clear validation error for coverFile
             if (validationErrors.coverFile) {
                 setValidationErrors(prevErrors => {
                     const newErrors = { ...prevErrors };
                     delete newErrors.coverFile;
                     return newErrors;
                 });
             }
        } else {
            setCoverPreviewUrl(null);
        }
    };

    const validateForm = () => {
        const errors = {};
        const { formData, logoFile, coverFile } = companyProfileData;

        if (!formData.companyName || formData.companyName.trim() === '') {
            errors.companyName = 'Company name is required.';
        }
        // Email is removed
        if (!formData.phone || formData.phone.trim() === '') {
             errors.phone = 'Phone is required.';
         }
        if (!formData.website || formData.website.trim() === '') {
            errors.website = 'Website is required.';
        }
        if (!formData.location || formData.location.trim() === '') {
             errors.location = 'Location is required.';
         }
        if (!formData.teamSize || formData.teamSize.trim() === '') {
             errors.teamSize = 'Team Size is required.';
         }
        if (!formData.industryId) { // Assuming 0 is not a valid industry ID
             errors.industryId = 'Industry is required.';
         }
        if (!formData.aboutCompany || formData.aboutCompany.trim() === '') {
            errors.aboutCompany = 'About Company is required.';
        }
        // Check for files
        if (!logoFile && !logoPreviewUrl) {
             errors.logoFile = 'Company logo is required.';
         }
         if (!coverFile && !coverPreviewUrl) {
             errors.coverFile = 'Company cover image is required.';
         }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0; // Return true if no errors
    };


    const handleSave = async () => {
        console.log("Attempting to save data:", companyProfileData);

        if (!validateForm()) {
            console.log("Form validation failed.", validationErrors);
            return; // Stop if validation fails
        }

        // Lấy User ID từ localStorage bằng key 'userId'
        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert("Không tìm thấy User ID trong Local Storage. Vui lòng đăng nhập lại.");
            console.error("User ID not found in localStorage.");
            return; // Dừng quá trình lưu nếu không có user ID
        }

        const apiFormData = new FormData();

        // Append form data with correct API field names
        apiFormData.append('UserId', userId); // Sử dụng user ID lấy từ localStorage
        apiFormData.append('CompanyName', companyProfileData.formData.companyName || '');
        apiFormData.append('CompanyProfileDescription', companyProfileData.formData.aboutCompany || '');
        apiFormData.append('Location', companyProfileData.formData.location || '');
        apiFormData.append('TeamSize', companyProfileData.formData.teamSize || '');
        apiFormData.append('Website', companyProfileData.formData.website || '');
        apiFormData.append('Contact', companyProfileData.formData.phone || '');
        apiFormData.append('IndustryId', parseInt(companyProfileData.formData.industryId) || 0);

        // Append files
        if (companyProfileData.logoFile) {
            apiFormData.append('logoFile', companyProfileData.logoFile);
        }
        if (companyProfileData.coverFile) {
            apiFormData.append('logoLgrFile', companyProfileData.coverFile);
        }

        // Make the API call
        try {
            const method = initialProfileData ? 'PUT' : 'POST'; // Determine method based on whether profile exists
            const url = initialProfileData ? `/api/CompanyProfile/${userId}` : '/api/CompanyProfile';

            const response = await fetch(url, {
                method: method,
                body: apiFormData,
                // headers: { 'Authorization': 'Bearer YOUR_TOKEN' } // Add auth header if needed
            });

            if (response.ok) {
                console.log('Company profile saved successfully!');
                setNotificationMessage("Company profile saved successfully."); // Set success message
                setShowNotification(true); // Show notification
                setIsEditing(false); // Exit edit mode on success
                fetchCompanyProfile(); // Refetch data to show updated info
            } else {
                const errorText = await response.text();
                console.error('Failed to save company profile:', response.status, errorText);
                // alert(`Lỗi khi lưu hồ sơ: ${response.status} - ${errorText}`); // Removed alert for network/other errors
                // Handle errors (e.g., show an error message based on errorText)
            }
        } catch (error) {
            console.error('Error saving company profile:', error);
            // alert(`Đã xảy ra lỗi mạng hoặc lỗi khác: ${error.message}`); // Removed alert for fetchCompanyProfile not defined
            // Handle network errors
        }
    };

    // Clean up object URLs when component unmounts or files change
    useEffect(() => {
        return () => {
            if (logoPreviewUrl) {
                URL.revokeObjectURL(logoPreviewUrl);
            }
            if (coverPreviewUrl) {
                URL.revokeObjectURL(coverPreviewUrl);
            }
        };
    }, [logoPreviewUrl, coverPreviewUrl]);

    // Effect to auto-hide notification
    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false);
                setNotificationMessage("");
            }, 3000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [showNotification]);

    return (
        <div className="widget-content">
            {isLoading ? (
                <div>Loading profile...</div> // Show loading indicator
            ) : (
                <>
                    <LogoCoverUploader
                        onLogoChange={handleLogoChange}
                        onCoverChange={handleCoverChange}
                        logoPreviewUrl={logoPreviewUrl}
                        coverPreviewUrl={coverPreviewUrl}
                        validationErrors={validationErrors} // Pass validation errors down
                        initialLogoUrl={logoPreviewUrl} // Pass fetched logo URL
                        initialCoverUrl={coverPreviewUrl} // Pass fetched cover URL
                        isEditing={isEditing} // Pass isEditing state
                    />
                    {/* End logo and cover photo components */}

                    <FormInfoBox
                        onFormChange={handleFormChange}
                        validationErrors={validationErrors} // Pass validation errors down
                        initialData={companyProfileData.formData} // Pass fetched form data
                        isEditing={isEditing} // Pass isEditing state
                    />
                    {/* compnay info box */}

                    <div className="form-group col-lg-12 col-md-12">
                        {!isEditing && initialProfileData && (
                           <button className="theme-btn btn-style-one" onClick={() => setIsEditing(true)}>
                               Edit Profile
                           </button>
                        )}
                        {isEditing && (
                           <>
                               <button className="theme-btn btn-style-one me-2" onClick={handleSave}>
                                   Save Profile
                               </button>
                               <button className="theme-btn btn-style-three" onClick={() => {
                                    setIsEditing(false);
                                    // Optionally reset form data to initialProfileData if user cancels
                                    // setCompanyProfileData(prevState => ({ ...prevState, formData: initialProfileData }));
                               }}>
                                   Cancel
                               </button>
                           </>
                        )}
                        {!initialProfileData && !isEditing && (
                            <button className="theme-btn btn-style-one" onClick={() => setIsEditing(true)}>
                                Create Profile
                            </button>
                        )}
                    </div>

                    {/* Temporary Notification */}
                    {showNotification && (
                        <div
                            className="alert alert-success"
                            role="alert"
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                right: '20px',
                                zIndex: 1050, // Ensure it's above most other elements
                                minWidth: '250px'
                            }}
                        >
                            {notificationMessage}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Index;
