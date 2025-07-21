import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

interface FileUploadSectionProps {
  title: string;
  description?: string;
  acceptedTypes: string[];
  isOptional?: boolean;
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  title,
  description,
  acceptedTypes,
  isOptional = false,
  onFilesChange,
  maxFiles = 1
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isValidType = acceptedTypes.some(type => {
      if (type === 'PDF') return fileExtension === 'pdf';
      if (type === 'JPG') return fileExtension === 'jpg' || fileExtension === 'jpeg';
      if (type === 'PNG') return fileExtension === 'png';
      return false;
    });

    if (!isValidType) {
      return `Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const generatePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const handleFiles = async (fileList: FileList | File[]) => {
    const newErrors: string[] = [];
    const validFiles: UploadedFile[] = [];

    const filesToProcess = Array.from(fileList);

    if (files.length + filesToProcess.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} file(s) allowed`);
    } else {
      for (const file of filesToProcess) {
        const error = validateFile(file);
        if (error) {
          newErrors.push(`${file.name}: ${error}`);
        } else {
          const preview = await generatePreview(file);
          validFiles.push({
            file,
            id: Math.random().toString(36).substr(2, 9),
            preview
          });
        }
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      toast({
        title: "Upload Error",
        description: newErrors.join('. '),
        variant: "destructive",
      });
    } else {
      setErrors([]);
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      
      if (validFiles.length > 0) {
        toast({
          title: "Files Uploaded",
          description: `${validFiles.length} file(s) uploaded successfully`,
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension === 'pdf' ? FileText : Image;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="overflow-hidden border-2 transition-all duration-300 hover:shadow-[var(--shadow-elegant)]">
      <CardHeader className="bg-gradient-to-r from-upload-bg to-upload-hover">
        <CardTitle className="flex items-center gap-2 text-lg">
          {title}
          {isOptional && (
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Optional
            </span>
          )}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Accepted formats: {acceptedTypes.join(', ')} • Max size: 10MB
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Upload Zone */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer group",
            isDragOver 
              ? "border-upload-border bg-upload-active scale-[1.02]" 
              : "border-upload-border/40 bg-upload-bg hover:bg-upload-hover hover:border-upload-border",
            files.length > 0 && "mb-4"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedTypes.map(type => {
              if (type === 'PDF') return '.pdf';
              if (type === 'JPG') return '.jpg,.jpeg';
              if (type === 'PNG') return '.png';
              return '';
            }).filter(Boolean).join(',')}
            multiple={maxFiles > 1}
            onChange={handleFileSelect}
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300",
              isDragOver ? "scale-110 bg-primary/20" : "group-hover:scale-105"
            )}>
              <Upload className={cn(
                "h-8 w-8 text-primary transition-colors duration-300",
                isDragOver && "animate-bounce-gentle"
              )} />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {isDragOver ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-sm text-muted-foreground">
                or <Button variant="link" className="p-0 h-auto font-medium text-primary">click to browse</Button>
              </p>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-destructive">{error}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              Uploaded Files ({files.length})
            </h4>
            
            {files.map((uploadedFile) => {
              const FileIcon = getFileIcon(uploadedFile.file.name);
              
              return (
                <div
                  key={uploadedFile.id}
                  className="flex items-center gap-3 p-3 bg-card border rounded-lg group hover:shadow-md transition-all duration-200"
                >
                  {uploadedFile.preview ? (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      <FileIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadedFile.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;