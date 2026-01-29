import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';

interface PixelDropzoneProps {
    onFilesChange: (files: File[]) => void;
    className?: string;
    maxFiles?: number;
}

interface PreviewFile extends File {
    preview: string;
}

export default function PixelDropzone({ onFilesChange, className, maxFiles = 5 }: PixelDropzoneProps) {
    const [files, setFiles] = useState<PreviewFile[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));

        setFiles(prev => {
            const updated = [...prev, ...newFiles].slice(0, maxFiles);
            onFilesChange(updated);
            return updated;
        });
    }, [maxFiles, onFilesChange]);

    const removeFile = (file: PreviewFile) => {
        setFiles(prev => {
            const updated = prev.filter(f => f !== file);
            onFilesChange(updated);
            return updated;
        });
        URL.revokeObjectURL(file.preview);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        maxFiles: maxFiles
    });

    useEffect(() => {
        // Cleanup previews on unmount
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, []);

    return (
        <div className={cn("space-y-4", className)}>
            <div 
                {...getRootProps()} 
                className={cn(
                    "border-2 border-dashed border-black p-8 text-center cursor-pointer transition-all bg-gray-50 hover:bg-gray-100",
                    isDragActive && "bg-blue-50 border-blue-500",
                    "font-vt323"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    {isDragActive ? (
                        <p className="text-xl">Drop the files here...</p>
                    ) : (
                        <div className="space-y-1">
                            <p className="text-xl">Drag & drop course images here</p>
                            <p className="text-sm text-gray-500">or click to select files (max {maxFiles})</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Grid */}
            {files.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {files.map((file, index) => (
                        <div key={index} className="relative group border-2 border-black shadow-pixel bg-white p-2">
                            <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                                <img
                                    src={file.preview}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(file)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white border-2 border-black p-1 shadow-sm hover:bg-red-600 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            <p className="mt-2 text-xs font-vt323 truncate px-1">{file.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
