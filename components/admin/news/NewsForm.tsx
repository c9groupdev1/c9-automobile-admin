import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { NewsItem } from '@/hooks/useNews';
import { useState } from 'react';
import { Image as ImageIcon, X, Loader2, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

const newsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  send_email: z.boolean(),
  send_popup: z.boolean(),
});

type NewsFormValues = {
  title: string;
  content: string;
  send_email: boolean;
  send_popup: boolean;
};

interface NewsFormProps {
  initialData?: NewsItem;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}

export function NewsForm({ initialData, onSubmit, isPending }: NewsFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_path || null);

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      send_email: initialData?.send_email || false,
      send_popup: initialData?.send_popup ?? true,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (values: NewsFormValues) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    formData.append('send_email', values.send_email ? '1' : '0');
    formData.append('send_popup', values.send_popup ? '1' : '0');
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400">News Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter a descriptive title for this update" 
                    className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-2 focus:ring-blue-500/20 font-bold transition-all"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-[10px] font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400">Content Body</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the update or announcement details here..." 
                    className="min-h-[250px] rounded-[2rem] bg-slate-50 border-slate-100 focus:ring-2 focus:ring-blue-500/20 font-medium p-6 resize-none transition-all"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-[10px] font-bold" />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400">Featured Media</FormLabel>
            {imagePreview ? (
              <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-dashed border-slate-200 aspect-video bg-slate-50">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-4 right-4 rounded-full h-10 w-10 shadow-xl"
                  onClick={removeImage}
                >
                  <X size={20} />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <label className="flex flex-col items-center justify-center w-full aspect-video rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-[#003399]/30 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#003399] transition-all mb-4">
                      <UploadCloud size={32} />
                    </div>
                    <p className="mb-2 text-sm text-slate-700 font-bold">Click to upload media</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">PNG, JPG or WEBP (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="send_email"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-3xl border border-slate-100 p-6 bg-slate-50/30">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-bold text-slate-900">Email Notification</FormLabel>
                    <FormDescription className="text-[10px] font-bold text-slate-500 uppercase">Notify users via email</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="send_popup"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-3xl border border-slate-100 p-6 bg-slate-50/30">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-bold text-slate-900">In-App Popup</FormLabel>
                    <FormDescription className="text-[10px] font-bold text-slate-500 uppercase">Show popup on next login</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full h-16 rounded-2xl bg-[#003399] hover:bg-blue-800 text-base font-bold shadow-xl shadow-blue-900/10 transition-all gap-3"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <ImageIcon size={20} />
          )}
          {initialData ? 'Update News Item' : 'Create News & Schedule'}
        </Button>
      </form>
    </Form>
  );
}
