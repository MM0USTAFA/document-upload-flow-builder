import DocumentUploadForm from '@/components/DocumentUploadForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-upload-bg py-12 px-4">
      <div className="container mx-auto">
        <DocumentUploadForm />
      </div>
    </div>
  );
};

export default Index;
