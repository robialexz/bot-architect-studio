/**
 * File Upload Component - Advanced file upload with drag & drop
 * Supports multiple files, progress tracking, and file processing
 */

import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  File, 
  X, 
  Check, 
  AlertCircle, 
  Image, 
  FileText, 
  Music, 
  Video,
  Database,
  Code,
  Archive,
  Loader2,
  Eye,
  Download,
  Trash2
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useServices } from '@/hooks/useServices';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  category: string;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  result?: any;
  preview?: string;
}

interface FileUploadProps {
  workflowId?: string;
  onFilesUploaded?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
  autoProcess?: boolean;
}

export function FileUpload({
  workflowId,
  onFilesUploaded,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes,
  autoProcess = false
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fileService } = useServices();

  const getFileCategory = (file: File): string => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();
    
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('pdf') || type.includes('document') || type.includes('word')) return 'document';
    if (type.includes('spreadsheet') || type.includes('excel') || name.endsWith('.csv')) return 'data';
    if (name.endsWith('.py') || name.endsWith('.js') || name.endsWith('.ts') || 
        name.endsWith('.html') || name.endsWith('.css') || name.endsWith('.sql')) return 'code';
    if (type.includes('text') || name.endsWith('.txt') || name.endsWith('.md')) return 'text';
    return 'other';
  };

  const getFileIcon = (category: string) => {
    switch (category) {
      case 'image':
        return <Image className="w-5 h-5 text-blue-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-green-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'data':
        return <Database className="w-5 h-5 text-orange-500" />;
      case 'code':
        return <Code className="w-5 h-5 text-gray-500" />;
      case 'text':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createFilePreview = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles: UploadedFile[] = [];
    
    for (const file of acceptedFiles) {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`);
        continue;
      }

      const preview = await createFilePreview(file);
      
      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        category: getFileCategory(file),
        status: 'pending',
        progress: 0,
        preview
      };
      
      newFiles.push(uploadedFile);
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, [uploadedFiles.length, maxFiles, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes ? acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}) : undefined,
    maxFiles: maxFiles - uploadedFiles.length,
    maxSize
  });

  const uploadFile = async (uploadedFile: UploadedFile) => {
    try {
      setUploadedFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ));

      const formData = new FormData();
      formData.append('file', uploadedFile.file);
      formData.append('description', description);
      formData.append('process_immediately', autoProcess.toString());
      if (workflowId) {
        formData.append('workflow_id', workflowId);
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === uploadedFile.id && f.progress < 90) {
            return { ...f, progress: f.progress + 10 };
          }
          return f;
        }));
      }, 200);

      const result = await fileService.uploadFile(formData);

      clearInterval(progressInterval);

      setUploadedFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { 
              ...f, 
              status: autoProcess ? 'processing' : 'completed',
              progress: 100,
              result
            }
          : f
      ));

      // If auto-processing, monitor processing status
      if (autoProcess && result.id) {
        monitorProcessing(uploadedFile.id, result.id);
      }

    } catch (error) {
      setUploadedFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { 
              ...f, 
              status: 'failed',
              progress: 0,
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          : f
      ));
    }
  };

  const monitorProcessing = async (uploadedFileId: string, fileId: string) => {
    const checkStatus = async () => {
      try {
        const fileInfo = await fileService.getFileInfo(fileId);
        
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === uploadedFileId) {
            if (fileInfo.status === 'processed') {
              return { ...f, status: 'completed', result: fileInfo };
            } else if (fileInfo.status === 'failed') {
              return { ...f, status: 'failed', error: 'Processing failed' };
            }
          }
          return f;
        }));

        if (fileInfo.status === 'processing') {
          setTimeout(checkStatus, 2000); // Check again in 2 seconds
        }
      } catch (error) {
        console.error('Failed to check processing status:', error);
      }
    };

    setTimeout(checkStatus, 1000);
  };

  const uploadAllFiles = async () => {
    setIsUploading(true);
    
    const pendingFiles = uploadedFiles.filter(f => f.status === 'pending');
    
    for (const file of pendingFiles) {
      await uploadFile(file);
    }
    
    setIsUploading(false);
    
    if (onFilesUploaded) {
      onFilesUploaded(uploadedFiles);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const retryUpload = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
      uploadFile(file);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'uploading':
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            File Upload
          </CardTitle>
          <CardDescription>
            Upload files to process in your workflows. Drag and drop or click to select files.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} ref={fileInputRef} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Maximum {maxFiles} files, up to {formatFileSize(maxSize)} each
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for these files..."
              rows={2}
              className="mt-1"
            />
          </div>

          {/* Auto-process option */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="auto-process"
              checked={autoProcess}
              onChange={(e) => setAutoProcess(e.target.checked)}
            />
            <label htmlFor="auto-process" className="text-sm">
              Process files immediately after upload
            </label>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={uploadAllFiles}
                  disabled={isUploading || uploadedFiles.every(f => f.status !== 'pending')}
                  className="flex items-center gap-2"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img 
                        src={file.preview} 
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-muted rounded">
                        {getFileIcon(file.category)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{file.name}</h4>
                      <Badge className={getStatusColor(file.status)}>
                        {file.status}
                      </Badge>
                      {getStatusIcon(file.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.category}</span>
                      {file.type && <span>{file.type}</span>}
                    </div>
                    
                    {/* Progress Bar */}
                    {(file.status === 'uploading' || file.status === 'processing') && (
                      <Progress value={file.progress} className="mt-2" />
                    )}
                    
                    {/* Error Message */}
                    {file.error && (
                      <p className="text-sm text-red-600 mt-1">{file.error}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {file.status === 'completed' && (
                      <>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    {file.status === 'failed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => retryUpload(file.id)}
                      >
                        Retry
                      </Button>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => removeFile(file.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
