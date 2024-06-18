import { 
  date, 
  json, 
  integer, 
  serial, 
  real, 
  text, 
  time,
  timestamp,
  pgTable, 
  uuid
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  authorId: integer('author_id').notNull(),
});
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));


// // Define the model for the information_schema.tables table
// const Table = defineModel('information_schema.tables', {
//   columns: {
//       table_name: 'string',
//       table_schema: 'string'
//   }
// });

const tables = pgTable('information_schema.tables', {
  table_name: text('table_name'),
  table_schema: text('table_schema')
})

const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  messages: json('messages'),
  session_name: text('session_name'),
  user_id: uuid('user_id'),
  session_id: uuid('session_id').notNull().defaultRandom(),
});

const models = pgTable('models', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  value: text('value').notNull(),
  description: text('description'),
  notes: text('notes'),
});

const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  inventory_name: text('inventory_name').notNull(),
  description: text('description'),
  photo: text('photo'),
});

const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  name: text('name').notNull(),
  page_id: text('page_id'),
});


const exercise = pgTable('exercise', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  name: text('name').notNull(),
  reps: integer('reps').notNull(),
  sets: integer('sets').notNull(),
  date: date('date').notNull(),
  time: time('time').notNull(),
  muscle: text('muscle'),
  difficulty: text('difficulty'),
  equipment: text('equipment'),
  instructions: text('instructions'),
  type: text('type'),
  user_id: uuid('user_id'),
  weight: integer('weight'),
  calories_burned: integer('calories_burned'),
});

const food = pgTable('food', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  name: text('name').notNull(),
  calories: integer('calories').notNull(),
  date: date('date').notNull(),
  time: time('time').notNull(),
  nutrients: json('nutrients'),
  user_id: uuid('user_id'),
  meal: text('meal').notNull(),
  num_servings: integer('num_servings').notNull(),
  serving_size: integer('serving_size').notNull()
});

const sleep = pgTable('sleep', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  "startDate": text('startDate').notNull(),
  "endDate": text('endDate').notNull(),
  value: text('value').notNull(),
  duration: text('duration').notNull(),
});

const steps = pgTable('steps', {
  id: serial('id').primaryKey().notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  value: integer('value'),
  "startDate": text('startDate'),
  "endDate": text('endDate'),
  duration: text('duration'),
  type: text('type'),
});

const weight = pgTable('weight', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  weight: text('weight').notNull(),
  date: date('date').notNull(),
  user_id: uuid('user_id'),
  time: time('time').notNull(),
});

const profile = pgTable('profile', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  age: integer('age').notNull(),
  height: integer('height').notNull(),
  weight: integer('weight').notNull(),
  goal: integer('goal').notNull(),
  exercise: real('exercise').notNull(),
  user_id: uuid('user_id'),
  tdee: integer('tdee').notNull(),
  bmr: integer('bmr').notNull(),
});

const cross_platform_apps = pgTable('cross_platform_apps', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  desitination_url: text('destination_url'),
  desitination_app: text('destination_app'),
  url: text('url'),
  user_id: uuid('user_id'),
  source: text('source'),
  appId: text('appId'),
  data: json('data'),
});


export { 
  // Woodward DB
  tables,
  // Storage App
  inventory,
  // Chat App
  chats,
  models,
  blogs,
  // Fitness App
  profile,
  exercise,
  food,
  sleep,
  steps,
  weight,
  // Cross Platform App
  cross_platform_apps
};