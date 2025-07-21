import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, FileText, Users, Building2, Image, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [personalOpen, setPersonalOpen] = useState(true);
  const [businessOpen, setBusinessOpen] = useState(true);
  const [brandingOpen, setBrandingOpen] = useState(true);
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

  const handleCollapseAll = () => {
    setPersonalOpen(false);
    setBusinessOpen(false);
    setBrandingOpen(false);
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
                National ID ({formData.nationalId.length}/5)
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${formData.commercialRegistration.length > 0 ? 'bg-success' : 'bg-muted'} transition-colors duration-300`} />
                Commercial Reg ({formData.commercialRegistration.length}/5)
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${formData.taxCertificate.length > 0 ? 'bg-success' : 'bg-muted'} transition-colors duration-300`} />
                Tax Cert ({formData.taxCertificate.length}/5)
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${formData.companyLogo.length > 0 ? 'bg-primary' : 'bg-muted'} transition-colors duration-300`} />
                Logo ({formData.companyLogo.length}/3)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collapse All Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleCollapseAll}
          className="flex items-center gap-2"
        >
          <ChevronUp className="h-4 w-4" />
          Collapse All Sections
        </Button>
      </div>

      {/* Upload Sections */}
      <div className="space-y-6">
        {/* Personal Documents Section */}
        <Collapsible open={personalOpen} onOpenChange={setPersonalOpen}>
          <Card className="border-2 border-primary/20">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-semibold text-foreground">Personal Documents</CardTitle>
                  </div>
                  {personalOpen ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <FileUploadSection
                  title="Upload your National ID"
                  description="Please upload clear images or PDFs of your national identification documents (front/back if applicable)"
                  acceptedTypes={['PDF', 'JPG', 'PNG']}
                  maxFiles={5}
                  onFilesChange={(files) => updateFormData('nationalId', files)}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Business Documents Section */}
        <Collapsible open={businessOpen} onOpenChange={setBusinessOpen}>
          <Card className="border-2 border-primary/20">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-semibold text-foreground">Business Documents</CardTitle>
                  </div>
                  {businessOpen ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <FileUploadSection
                  title="Upload your Commercial Registration Document"
                  description="Upload your business registration certificates, commercial licenses, or related documents"
                  acceptedTypes={['PDF', 'JPG', 'PNG']}
                  maxFiles={5}
                  onFilesChange={(files) => updateFormData('commercialRegistration', files)}
                />
                
                <Separator className="my-4" />
                
                <FileUploadSection
                  title="Upload your Tax Certificate"
                  description="Please provide your tax registration certificates, tax ID documents, or related tax documents"
                  acceptedTypes={['PDF', 'JPG', 'PNG']}
                  maxFiles={5}
                  onFilesChange={(files) => updateFormData('taxCertificate', files)}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Branding Section */}
        <Collapsible open={brandingOpen} onOpenChange={setBrandingOpen}>
          <Card className="border-2 border-primary/20">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-semibold text-foreground">Branding (Optional)</CardTitle>
                  </div>
                  {brandingOpen ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <FileUploadSection
                  title="Upload your Company Logo"
                  description="Upload your company logos, brand assets, or marketing materials (optional)"
                  acceptedTypes={['JPG', 'PNG']}
                  isOptional={true}
                  maxFiles={3}
                  onFilesChange={(files) => updateFormData('companyLogo', files)}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
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