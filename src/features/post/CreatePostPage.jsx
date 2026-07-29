import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { createPost } from '../../api/postApi';
import { Image as ImageIcon, X, UploadCloud, Loader2, PlusSquare } from 'lucide-react';
import clsx from 'clsx';

export default function CreatePostPage() {
  const [caption, setCaption] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check max files (e.g., 10)
    if (selectedFiles.length + files.length > 10) {
      setError('You can only upload a maximum of 10 images.');
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setError(null);
  };

  const removeImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Please select at least one image.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('caption', caption);
    selectedFiles.forEach((file) => {
      formData.append('images[]', file);
    });

    try {
      await createPost(formData);
      navigate('/');
    } catch (err) {
      // Backend validation errors usually come as an object
      const errMsg = err.response?.data?.message || err.message || 'Failed to create post.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col w-full max-w-[600px] mx-auto min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
          <h1 className="text-xl font-bold text-black tracking-tight">Create new post</h1>
          <button 
            onClick={handleSubmit}
            disabled={isLoading || selectedFiles.length === 0}
            className="text-sm font-semibold text-blue-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Share
          </button>
        </div>

        <div className="p-4 flex-1">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Image Upload Section */}
            <div>
              {previews.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-zinc-100 border border-gray-200 group">
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {previews.length < 10 && (
                    <label className="relative aspect-square rounded-md border-2 border-dashed border-gray-300 hover:border-black hover:bg-zinc-50 transition-colors flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-black">
                      <PlusSquare className="w-8 h-8 mb-2" />
                      <span className="text-xs font-medium">Add More</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-zinc-50 hover:bg-zinc-100 transition-colors">
                  <UploadCloud className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-black mb-1">Upload Photos</h3>
                  <p className="text-sm text-gray-500 mb-6">Select up to 10 photos to share</p>
                  
                  <label className="bg-black hover:bg-gray-800 text-white text-sm font-semibold py-2 px-4 rounded-md cursor-pointer transition-colors">
                    Select from computer
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Caption Section */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-gray-400" />
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full min-h-[100px] resize-none outline-none text-sm text-black placeholder:text-gray-400 pt-1.5"
                maxLength={2200}
              />
            </div>
          </form>
        </div>
      </div>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
          <p className="text-sm font-medium text-black">Sharing...</p>
        </div>
      )}
    </MainLayout>
  );
}
