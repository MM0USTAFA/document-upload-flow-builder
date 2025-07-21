import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, FileText, Users, Building2, Image } from 'lucide-react';
import FileUploadSection from './DocumentUpload';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

interface FormData {
  nationalId: UploadedFile[];
  commercialRegistration: UploadedFile[];
  taxCertificate: UploadedFile[];
  companyLogo: UploadedFile[];
}

const DocumentUploadForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nationalId: [],
    commercialRegistration: [],
    taxCertificate: [],
    companyLogo: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateFormData = (section: keyof FormData, files: UploadedFile[]) => {
    setFormData(prev => ({
      ...prev,
      [section]: files
    }));
  };

  const getCompletionPercentage = () => {
    const requiredSections = ['nationalId', 'commercialRegistration', 'taxCertificate'];
    const completedSections = requiredSections.filter(section => 
      formData[section as keyof FormData].length > 0
    ).length;
    return Math.round((completedSections / requiredSections.length) * 100);
  };

  const isFormValid = () => {
    return formData.nationalId.length > 0 && 
           formData.commercialRegistration.length > 0 && 
           formData.taxCertificate.length > 0;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: "Incomplete Form",
        description: "Please upload all required documents before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Documents Uploaded Successfully!",
        description: "Your documents have been submitted for review.",
      });
      
      // Reset form
      setFormData({
        nationalId: [],
        commercialRegistration: [],
        taxCertificate: [],
        companyLogo: []
      });
      
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-upload-bg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Document Upload Center
          </CardTitle>
          <p className="text-muted-foreground text-lg mt-2">
            Upload your required documents to complete your registration
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{getCompletionPercentage()}% Complete</span>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${formData.nationalId.length > 0 ? 'bg-success' : 'bg-muted'} transition-colors duration-300`} />
                National ID
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${formData.commercialRegistration.length > 0 ? 'bg-success' : 'bg-muted'} transition-colors duration-300`} />
                Commercial Registration
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${formData.taxCertificate.length > 0 ? 'bg-success' : 'bg-muted'} transition-colors duration-300`} />
                Tax Certificate
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${formData.companyLogo.length > 0 ? 'bg-primary' : 'bg-muted'} transition-colors duration-300`} />
                Company Logo
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Sections */}
      <div className="space-y-6">
        {/* National ID */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Personal Documents</h3>
          </div>
          <FileUploadSection
            title="Upload your National ID"
            description="Please upload a clear image or PDF of your national identification document"
            acceptedTypes={['PDF', 'JPG', 'PNG']}
            onFilesChange={(files) => updateFormData('nationalId', files)}
          />
        </div>

        <Separator className="my-8" />

        {/* Business Documents */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Business Documents</h3>
          </div>
          
          {/* Commercial Registration */}
          <FileUploadSection
            title="Upload your Commercial Registration Document"
            description="Upload your business registration certificate or commercial license"
            acceptedTypes={['PDF', 'JPG', 'PNG']}
            onFilesChange={(files) => updateFormData('commercialRegistration', files)}
          />

          {/* Tax Certificate */}
          <FileUploadSection
            title="Upload your Tax Certificate"
            description="Please provide your tax registration certificate or tax ID document"
            acceptedTypes={['PDF', 'JPG', 'PNG']}
            onFilesChange={(files) => updateFormData('taxCertificate', files)}
          />
        </div>

        <Separator className="my-8" />

        {/* Company Logo */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Image className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Branding (Optional)</h3>
          </div>
          <FileUploadSection
            title="Upload your Company Logo"
            description="Upload your company logo for branding purposes (optional)"
            acceptedTypes={['JPG', 'PNG']}
            isOptional={true}
            onFilesChange={(files) => updateFormData('companyLogo', files)}
          />
        </div>
      </div>

      {/* Submit Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-upload-bg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="font-medium text-foreground">Ready to submit?</p>
              <p className="text-sm text-muted-foreground">
                {isFormValid() 
                  ? "All required documents have been uploaded" 
                  : "Please upload all required documents to continue"
                }
              </p>
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              size="lg"
              className="w-full sm:w-auto min-w-[140px] bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Submit Documents
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUploadForm;