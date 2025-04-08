import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fonts } from '@/config/fonts'
import { useFont } from '@/context/font-context'
import { useTheme } from '@/context/theme-context'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Radio, RadioGroup } from '@heroui/react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark'], {
    required_error: 'Please select a theme.',
  }),
  font: z.enum(fonts, {
    invalid_type_error: 'Select a font',
    required_error: 'Please select a font.',
  }),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

interface ThemeRadioProps {
  children: React.ReactNode;
  preview: React.ReactNode;
  value: string;
  defaultValue: string;
  id: string;
  [key: string]: any;
}

const ThemeRadio = (props: ThemeRadioProps) => {
  const { children, preview, value, defaultValue, id, ...otherProps } = props;
  const isSelected = defaultValue === value;

  return (
    <div className="relative">
      <Radio
        {...otherProps}
        value={value}
        id={id}
        className="sr-only left-10 -z-10"
      />
      <label 
        htmlFor={id} 
        className="cursor-pointer inline-flex flex-col items-center"
      >
        <div className={cn(
          'items-center rounded-md border-2 p-1',
          isSelected ? 'border-primary' : 'border-muted'
        )}>
          {preview}
        </div>
        <span className='block w-full p-2 text-center font-normal'>
          {children}
        </span>
      </label>
    </div>
  );
};

export function AppearanceForm() {
  const { font, setFont } = useFont()
  const { theme, setTheme } = useTheme()

  // This can come from your database or API.
  const defaultValues: Partial<AppearanceFormValues> = {
    theme: theme as 'light' | 'dark',
    font,
  }

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  })

  function onSubmit(data: AppearanceFormValues) {
    if (data.font != font) setFont(data.font)
    if (data.theme != theme) setTheme(data.theme)

    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='font'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font</FormLabel>
              <FormControl>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="选择字体" />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font} value={font}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription className='font-manrope'>
                Set the font you want to use in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='theme'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Theme</FormLabel>
              <FormDescription>
                Select the theme for the dashboard.
              </FormDescription>
              <FormMessage />
              <RadioGroup
                orientation="horizontal"
                onValueChange={field.onChange}
                defaultValue={field.value}
                className='flex space-x-16 pt-2'
              >
                <ThemeRadio 
                  defaultValue={field.value}
                  value='light'
                  id="light"
                  preview={
                    <div className='space-y-2 rounded-sm bg-[#ecedef] p-2'>
                      <div className='space-y-2 rounded-md bg-white p-2 shadow-sm'>
                        <div className='h-2 w-[80px] rounded-lg bg-[#ecedef]' />
                        <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                      </div>
                      <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
                        <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                        <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                      </div>
                      <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
                        <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                        <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                      </div>
                    </div>
                  }
                >
                  Light
                </ThemeRadio>
                <ThemeRadio 
                  defaultValue={field.value}
                  value='dark'
                  id="dark"
                  preview={
                    <div className='space-y-2 rounded-sm bg-slate-950 p-2'>
                      <div className='space-y-2 rounded-md bg-slate-800 p-2 shadow-sm'>
                        <div className='h-2 w-[80px] rounded-lg bg-slate-400' />
                        <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                      </div>
                      <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm'>
                        <div className='h-4 w-4 rounded-full bg-slate-400' />
                        <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                      </div>
                      <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm'>
                        <div className='h-4 w-4 rounded-full bg-slate-400' />
                        <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                      </div>
                    </div>
                  }
                >
                  Dark
                </ThemeRadio>
              </RadioGroup>
            </FormItem>
          )}
        />

        <Button type='submit'>Update preferences</Button>
      </form>
    </Form>
  )
}
