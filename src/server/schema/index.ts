import { relations } from "drizzle-orm"
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

// ==========================================
// 1. ENUMS
// ==========================================
export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "archived",
])

export const pricingEnum = pgEnum("resource_pricing", [
  "Free",
  "MIT",
  "Freemium",
  "Paid",
])

export const twitterCardEnum = pgEnum("twitter_card", [
  "summary_large_image",
  "summary",
])

// ==========================================
// 1. USERS & ACCOUNT
// ==========================================
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  avatarUrl: text("avatar_url"),
  role: varchar("role", { length: 50 }).default("admin").notNull(),
  // Dùng cho tính năng ĐỔI MẬT KHẨU:
  // Khi đổi mật khẩu, cập nhật thời điểm này để logout toàn bộ các thiết bị cũ
  passwordChangedAt: timestamp("password_changed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})
// ==========================================
// 2. SESSIONS (Phiên đăng nhập Admin)
// ==========================================
export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(), // Session token / Cookie ID
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("session_user_idx").on(t.userId)]
)
// ==========================================
// 3. PASSWORD RESET TOKENS (Quên mật khẩu)
// ==========================================
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Mã bí mật gửi qua email cho user (được mã hóa sha256)
    tokenHash: text("token_hash").notNull().unique(),

    // Thời hạn token (thường set 15 - 30 phút kể từ lúc gửi)
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

    // Đánh dấu đã dùng hay chưa (ngăn chặn dùng lại token)
    usedAt: timestamp("used_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("reset_token_hash_idx").on(t.tokenHash)]
)

// ==========================================
// 3. BLOG: CATEGORIES & TAGS & GROUPS
// ==========================================

// Danh mục bài viết (Frontend, Backend, DevOps...)
export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 50 }), // Mã màu HEX ví dụ #3b82f6
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

// Thẻ bài viết (#react, #typescript, #docker...)
export const tags = pgTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

// Chuỗi bài viết / Series (ví dụ: NestJS Mastery, React Native A-Z)
export const postGroups = pgTable("post_groups", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  coverImage: text("cover_image"), // ImageKit URL
  isCompleted: boolean("is_completed").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

// ==========================================
// 4. BLOG: POSTS
// ==========================================
export const posts = pgTable("posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"), // ImageKit URL
  coverImageAlt: varchar("cover_image_alt", { length: 255 }),

  // Series / Group
  groupId: text("group_id").references(() => postGroups.id, {
    onDelete: "set null",
  }),
  groupOrder: integer("group_order"), // Số thứ tự bài viết trong series (1, 2, 3...)

  // Trạng thái & Xuất bản
  status: postStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  readTime: integer("read_time").default(5).notNull(), // Phút đọc
  isFeatured: boolean("is_featured").default(false).notNull(),

  // Thân bài viết: Lưu dạng JSON (Tiptap / Slate / ProseMirror AST)
  content: jsonb("content").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

// Bảng liên kết nhiều-nhiều: Posts <-> Categories
export const postsToCategories = pgTable(
  "posts_to_categories",
  {
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.categoryId] })]
)

// Bảng liên kết nhiều-nhiều: Posts <-> Tags
export const postsToTags = pgTable(
  "posts_to_tags",
  {
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })]
)

// ==========================================
// 5. RESOURCES & TOOLS
// ==========================================

// Danh mục tài nguyên (UI Libraries, Icons, Colors, 3D...)
export const resourceCategories = pgTable("resource_categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  icon: varchar("icon", { length: 100 }), // Tên Lucide icon hoặc emoji
  color: varchar("color", { length: 50 }), // Mã màu HEX
  order: integer("order").default(0).notNull(), // Thứ tự sắp xếp tab
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

// Danh sách tài nguyên / công cụ
export const resources = pgTable("resources", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  url: text("url").notNull(),
  description: text("description"),
  coverImage: text("cover_image").notNull(), // Screenshot ImageKit URL
  coverImageAlt: varchar("cover_image_alt", { length: 255 }).default(
    "Resource preview"
  ),
  logo: text("logo"), // Favicon / Brand Logo ImageKit URL

  // Thuộc danh mục nào
  categoryId: text("category_id")
    .notNull()
    .references(() => resourceCategories.id, { onDelete: "restrict" }),

  pricing: pricingEnum("pricing").default("Free").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

// ==========================================
// 6. SITE SETTINGS (SEO, Icons, Socials)
// ==========================================
export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("default"), // Chỉ 1 record cấu hình duy nhất

  // General
  siteTitle: varchar("site_title", { length: 255 }).notNull(),
  siteName: varchar("site_name", { length: 150 }),
  siteDescription: text("site_description"),
  siteUrl: text("site_url"),
  author: varchar("author", { length: 150 }),
  keywords: jsonb("keywords").$type<string[]>().default([]),
  coverImage: text("cover_image"),
  coverImageAlt: varchar("cover_image_alt", { length: 255 }),

  // SEO & Social Share
  ogImage: text("og_image"),
  ogImageAlt: varchar("og_image_alt", { length: 255 }),
  twitterCard: twitterCardEnum("twitter_card").default("summary_large_image"),
  twitterHandle: varchar("twitter_handle", { length: 100 }),

  // Favicons & App Icons (ImageKit URLs)
  favicon: text("favicon"),
  favicon16: text("favicon_16"),
  favicon32: text("favicon_32"),
  appleTouchIcon: text("apple_touch_icon"),
  androidChrome192: text("android_chrome_192"),
  androidChrome512: text("android_chrome_512"),
  safariMaskIcon: text("safari_mask_icon"),

  // PWA & Theme Colors
  themeColor: varchar("theme_color", { length: 50 }),
  backgroundColor: varchar("background_color", { length: 50 }),

  // Socials
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

// ==========================================
// 7. DRIZZLE RELATIONS (Để Query siêu nhanh)
// ==========================================

// ==========================================
// DRIZZLE RELATIONS CHO AUTH
// ==========================================
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  resetTokens: many(passwordResetTokens),
}))
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))
export const passwordResetTokensRelations = relations(
  passwordResetTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetTokens.userId],
      references: [users.id],
    }),
  })
)

export const postsRelations = relations(posts, ({ one, many }) => ({
  group: one(postGroups, {
    fields: [posts.groupId],
    references: [postGroups.id],
  }),
  categories: many(postsToCategories),
  tags: many(postsToTags),
}))

export const postGroupsRelations = relations(postGroups, ({ many }) => ({
  posts: many(posts),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(postsToCategories),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postsToTags),
}))

export const postsToCategoriesRelations = relations(
  postsToCategories,
  ({ one }) => ({
    post: one(posts, {
      fields: [postsToCategories.postId],
      references: [posts.id],
    }),
    category: one(categories, {
      fields: [postsToCategories.categoryId],
      references: [categories.id],
    }),
  })
)

export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
  post: one(posts, {
    fields: [postsToTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postsToTags.tagId],
    references: [tags.id],
  }),
}))

export const resourcesRelations = relations(resources, ({ one }) => ({
  category: one(resourceCategories, {
    fields: [resources.categoryId],
    references: [resourceCategories.id],
  }),
}))

export const resourceCategoriesRelations = relations(
  resourceCategories,
  ({ many }) => ({
    resources: many(resources),
  })
)
