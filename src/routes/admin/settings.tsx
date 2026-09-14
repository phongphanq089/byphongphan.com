import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute } from "@tanstack/react-router"
import { Check, Database, HardDrive, Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FileUpload,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/shared/ui"

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
})

const settingsFormSchema = z.object({
  // General & Branding
  siteTitle: z
    .string()
    .min(3, "Site title must be at least 3 characters")
    .max(120, "Title cannot exceed 120 characters"),
  siteName: z
    .string()
    .min(2, "Site short name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),
  author: z
    .string()
    .min(2, "Author name must be at least 2 characters")
    .max(80, "Author name cannot exceed 80 characters"),
  siteBio: z
    .string()
    .min(10, "Bio should be at least 10 characters")
    .max(400, "Bio cannot exceed 400 characters"),

  // SEO & Open Graph
  seoDescription: z
    .string()
    .min(10, "SEO description should be at least 10 characters")
    .max(300, "SEO description should not exceed 300 characters"),
  keywords: z.string().min(3, "Please specify at least 1 or 2 keywords"),
  twitterCard: z.enum(["summary_large_image", "summary"]),
  twitterHandle: z
    .string()
    .min(2, "Twitter handle is required")
    .startsWith("@", "Twitter handle should start with @"),

  // Social Links
  githubUrl: z
    .string()
    .url("Must be a valid URL (e.g. https://github.com/...)")
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Must be a valid URL (e.g. https://linkedin.com/...)")
    .or(z.literal("")),
  twitterUrl: z
    .string()
    .url("Must be a valid URL (e.g. https://x.com/...)")
    .or(z.literal("")),
  contactEmail: z.string().email("Please enter a valid contact email address"),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

const DEFAULT_SETTINGS: SettingsFormValues = {
  siteTitle: "Phong Phan — Frontend Architect & Creative Developer",
  siteName: "Phong Phan Portfolio",
  author: "Phong Phan",
  siteBio:
    "Senior Frontend Engineer specializing in high-craft UI/UX, React 19, WebGL shaders, and performance.",
  seoDescription:
    "Interactive developer portfolio, curated technical articles, and open-source UI component registry.",
  keywords:
    "react, typescript, tailwind-v4, vite-8, webgl, frontend, architecture",
  twitterCard: "summary_large_image",
  twitterHandle: "@phongdev",
  githubUrl: "https://github.com/phongphanq089",
  linkedinUrl: "https://linkedin.com/in/phong-phan",
  twitterUrl: "https://twitter.com/phongdev",
  contactEmail: "phong.phan@example.com",
}

function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isSaved, setIsSaved] = useState(false)
  const [avatarFiles, setAvatarFiles] = useState<unknown[]>([])
  const [ogFiles, setOgFiles] = useState<unknown[]>([])

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: DEFAULT_SETTINGS,
    mode: "onChange",
  })

  const { control, handleSubmit, watch } = form

  const watchSiteTitle = watch("siteTitle")
  const watchSeoDesc = watch("seoDescription")

  const onSubmit = (values: SettingsFormValues) => {
    console.log("Saving site settings:", values)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 pb-12"
      >
        {/* ─── Page Header ─── */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Site Settings & SEO
              </h1>
              <Badge
                variant="outline"
                className="rounded-md border-border/80 bg-muted/40 font-mono text-xs"
              >
                Validated
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Global metadata, Open Graph social cards, author profile, and
              serverless database status.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="submit"
              size="sm"
              className="h-9 gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
            >
              {isSaved ? (
                <>
                  <Check className="size-4 text-emerald-300" />
                  <span>Saved Successfully</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ─── Settings Tabs ─── */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="h-9 rounded-lg bg-muted/60 p-1">
            <TabsTrigger
              value="general"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              General & Branding
            </TabsTrigger>
            <TabsTrigger
              value="seo"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              SEO & Open Graph
            </TabsTrigger>
            <TabsTrigger
              value="socials"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              Socials & Links
            </TabsTrigger>
            <TabsTrigger
              value="infrastructure"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              Infrastructure & DB
            </TabsTrigger>
          </TabsList>

          {/* ─── Tab 1: General & Branding ─── */}
          <TabsContent value="general" className="m-0 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left: Avatar Upload */}
              <Card className="rounded-xl border-border/70 bg-card/60 p-5 shadow-xs">
                <CardHeader className="p-0 pb-4 text-center">
                  <CardTitle className="text-sm font-bold">
                    Author Avatar
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Displayed on the sidebar, header, and author biography
                    chips.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center p-0">
                  <FileUpload
                    variant="avatar"
                    files={avatarFiles}
                    onupdatefiles={setAvatarFiles}
                    maxFileSize="5MB"
                    acceptedFileTypes={[
                      "image/png",
                      "image/jpeg",
                      "image/webp",
                    ]}
                  />
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    Click or drag square photo (recommended 400x400px).
                  </p>
                </CardContent>
              </Card>

              {/* Right: General Details Form */}
              <Card className="space-y-4 rounded-xl border-border/70 bg-card/60 p-6 shadow-xs lg:col-span-2">
                <FormField
                  control={control}
                  name="siteTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Title</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 rounded-lg text-xs" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Short Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-9 rounded-lg text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author Full Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-9 rounded-lg text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name="siteBio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Biography / Tagline</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          className="rounded-lg text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>
            </div>
          </TabsContent>

          {/* ─── Tab 2: SEO & Open Graph ─── */}
          <TabsContent value="seo" className="m-0 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Meta Configuration */}
              <Card className="space-y-4 rounded-xl border-border/70 bg-card/60 p-6 shadow-xs">
                <FormField
                  control={control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          className="rounded-lg text-xs"
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value.length}/160 characters recommended for SEO.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Keywords (Comma Separated)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-9 rounded-lg font-mono text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="twitterCard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Card Style</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-9 w-full rounded-lg text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            <SelectItem value="summary_large_image">
                              summary_large_image (1200x630)
                            </SelectItem>
                            <SelectItem value="summary">
                              summary (Square)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="twitterHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Handle</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-9 rounded-lg font-mono text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Custom FilePond OG Banner Upload */}
                <div className="space-y-2 pt-2">
                  <FormLabel>Open Graph Social Banner (OG Image)</FormLabel>
                  <FileUpload
                    variant="cover"
                    files={ogFiles}
                    onupdatefiles={setOgFiles}
                    maxFileSize="10MB"
                    acceptedFileTypes={[
                      "image/png",
                      "image/jpeg",
                      "image/webp",
                    ]}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Standard 1200x630px image used for Discord, Twitter,
                    LinkedIn previews.
                  </p>
                </div>
              </Card>

              {/* Social Share Live Previews */}
              <div className="space-y-4">
                {/* Google Search SERP Preview */}
                <Card className="space-y-2 rounded-xl border border-border/70 bg-card/60 p-5 shadow-xs">
                  <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Google Search Preview
                  </p>
                  <div className="space-y-1 rounded-lg border border-border/80 bg-background/50 p-4 font-sans">
                    <p className="text-xs text-muted-foreground">
                      https://phongdev.me
                    </p>
                    <p className="line-clamp-1 cursor-pointer text-sm font-semibold text-primary hover:underline">
                      {watchSiteTitle}
                    </p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {watchSeoDesc}
                    </p>
                  </div>
                </Card>

                {/* Twitter / X Social Card Preview */}
                <Card className="space-y-2 rounded-xl border border-border/70 bg-card/60 p-5 shadow-xs">
                  <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Twitter / X Card Preview
                  </p>
                  <div className="overflow-hidden rounded-xl border border-border/80 bg-background/50">
                    <div className="flex aspect-video w-full items-center justify-center bg-muted/60 text-xs text-muted-foreground">
                      1200 x 630 OG Social Banner
                    </div>
                    <div className="space-y-0.5 p-3">
                      <p className="text-[11px] text-muted-foreground">
                        phongdev.me
                      </p>
                      <p className="line-clamp-1 text-xs font-bold text-foreground">
                        {watchSiteTitle}
                      </p>
                      <p className="line-clamp-2 text-[11px] text-muted-foreground">
                        {watchSeoDesc}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ─── Tab 3: Socials & Links ─── */}
          <TabsContent value="socials" className="m-0">
            <Card className="max-w-2xl space-y-4 rounded-xl border-border/70 bg-card/60 p-6 shadow-xs">
              <FormField
                control={control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Profile URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-9 rounded-lg font-mono text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-9 rounded-lg font-mono text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="twitterUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter / X URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-9 rounded-lg font-mono text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-9 rounded-lg font-mono text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </TabsContent>

          {/* ─── Tab 4: Infrastructure & DB ─── */}
          <TabsContent value="infrastructure" className="m-0 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card className="space-y-3 rounded-xl border-border/70 bg-card/60 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="size-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-foreground">
                      Neon Serverless PostgreSQL
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-md border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-400"
                  >
                    CONNECTED
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Connected to project pooler in AWS Singapore (ap-southeast-1)
                  using WebSocket driver.
                </p>
                <div className="space-y-1 border-t border-border/60 pt-2 font-mono text-[11px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Branch:</span>
                    <span className="text-foreground">main</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SSL Mode:</span>
                    <span className="text-foreground">require</span>
                  </div>
                </div>
              </Card>

              <Card className="space-y-3 rounded-xl border-border/70 bg-card/60 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="size-4 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">
                      ImageKit Media CDN
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-md border-primary/40 bg-primary/10 text-[10px] font-semibold text-primary"
                  >
                    ACTIVE
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Direct media asset hosting, automatic WebP/AVIF
                  transformations, and edge delivery.
                </p>
                <div className="space-y-1 border-t border-border/60 pt-2 font-mono text-[11px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Endpoint:</span>
                    <span className="text-foreground">
                      ik.imagekit.io/phongdev
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Upload Method:</span>
                    <span className="text-foreground">
                      FilePond Client Direct
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}
