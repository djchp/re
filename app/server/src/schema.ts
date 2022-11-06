import { permissions } from './permissions'
import { APP_SECRET, getUserId } from './utils'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { applyMiddleware } from 'graphql-middleware'
import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
  nullable,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'
import { config } from 'process'
import { raw } from '@prisma/client/runtime'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.user.findMany()
      },
    })

    t.nullable.field('me', {
      type: 'User',
      resolve: (parent, args, context: Context) => {
        const userId = getUserId(context)
        return context.prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        })
      },
    })

    t.list.field('users', {
      type: 'User',
      resolve: (parent, args, context: Context) => {
        return context.prisma.user.findMany()
      },
    })

    t.list.field('tweets', {
      type: 'Tweet',
      resolve: (parent, args, context: Context) => {
        return context.prisma.tweet.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        })
      },
    })
    t.nullable.field('tweet', {
      type: 'Tweet',
      args: {
        id: intArg(),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.tweet.findUnique({
          where: { id: Number(args.id) },
        })
      },
    })
    t.nullable.field('user', {
      args: {
        profileName: stringArg(),
      },
      type: 'User',
      resolve: (parent, args, context: Context) => {
        return context.prisma.user.findFirst({
          where: {
            name: args.profileName,
          },
        })
      },
    })
    t.list.field('tweetsbyuser', {
      type: 'Tweet',
      args: {
        id: intArg(),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.tweet.findMany({
          where: {
            authorId: args.id,
          },
        })
      },
    })
    t.list.field('tweetslikedbyuser', {
      type: 'LikedTweet',
      args: {
        id: intArg(),
      },
      resolve: (parent, args, context: Context) => {
        return context.prisma.likedTweet.findMany({
          where: {
            userId: args.id,
          },
        })
      },
    })
    t.list.field('userstofollow', {
      type: 'User',
      resolve: async (parent, args, context: Context) => {
        return context.prisma.$queryRawUnsafe(
          `SELECT * From "User" ORDER BY RANDOM() LIMIT 3`,
        )
      },
    })
    t.list.field('trendingtweets', {
      type: 'Tweet',
      resolve: async (parent, args, context: Context) => {
        return context.prisma.tweet.findMany({
          take: 4,
          orderBy: {
            likes: {
              _count: 'desc',
            },
          },
        })
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        const hashedPassword = await hash(args.password, 10)
        const user = await context.prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
          },
        })
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { email, password }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })
    t.field('createProfile', {
      type: 'Profile',
      args: {
        description: stringArg(),
        photo: stringArg(),
        profileSite: stringArg(),
      },
      resolve: (parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('not auth')
        return context.prisma.profile.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })
    t.field('updateProfile', {
      type: 'Profile',
      args: {
        id: intArg(),
        description: stringArg(),
        photo: stringArg(),
        profileSite: stringArg(),
      },
      resolve: (parent, { id, ...args }, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('not auth')
        return context.prisma.profile.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })
    t.field('createTweet', {
      type: 'Tweet',
      args: {
        body: stringArg(),
      },
      resolve: (_parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('not auth')
        return context.prisma.tweet.create({
          data: {
            body: args.body,
            author: { connect: { id: Number(userId) } },
          },
        })
      },
    })
    t.field('createReply', {
      type: 'Reply',
      args: {
        body: stringArg(),
        tweetId: intArg(),
      },
      resolve: (_parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('not auth')
        return context.prisma.reply.create({
          data: {
            body: args.body,
            User: { connect: { id: Number(userId) } },
            Tweet: { connect: { id: Number(args.tweetId) } },
          },
        })
      },
    })
    t.field('createReplyToReply', {
      type: 'Reply',
      args: {
        body: stringArg(),
        replyId: intArg(),
      },
      resolve: (parent, args, context: Context) => {
        const userId = getUserId(context)
        return context.prisma.reply.create({
          data: {
            body: args.body,
            User: { connect: { id: Number(userId) } },
            Reply: { connect: { id: Number(args.replyId) } },
          },
        })
      },
    })
    t.field('likeTweet', {
      type: 'LikedTweet',
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('not auth')
        return context.prisma.likedTweet.create({
          data: {
            tweet: { connect: { id: Number(args.id) } },
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })
    t.field('dislikeTweet', {
      type: 'LikedTweet',
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context: Context) => {
        const userId = getUserId(context)
        if (!userId) throw new Error('not auth')
        return context.prisma.likedTweet.delete({
          where: { id: Number(args.id) },
        })
      },
    })
    t.field('follow', {
      type: 'Follow',
      args: {
        target: stringArg(),
        followId: intArg(), 
      },
    })
  },
})

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.nonNull.string('email')
    t.field('Profile', {
      type: 'Profile',
      resolve: (parent, args, context: Context) => {
        return context.prisma.profile.findUnique({
          where: { userId: parent.id || undefined },
        })
      },
    })
    t.list.field('tweets', {
      type: 'Tweet',
      resolve: (parent, _, context: Context) => {
        return context.prisma.tweet.findMany({
          where: { authorId: parent.id || undefined },
        })
      },
    })
    t.list.field('likedTweets', {
      type: 'LikedTweet',
      resolve: (parent, _, context: Context) => {
        return context.prisma.likedTweet.findMany({
          where: { userId: parent.id || undefined },
        })
      },
    })
    t.list.field('replies', {
      type: 'Reply',
      resolve: (parent, _, context: Context) => {
        return context.prisma.reply.findMany({
          where: { userId: parent.id },
        })
      },
    })
  },
})

const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.nonNull.int('id')
    t.string('description')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.string('photo')
    t.string('profileSite')
    t.field('User', {
      type: 'User',
      resolve: (parent, _, context: Context) => {
        return context.prisma.profile
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .User()
      },
    })
  },
})

const Tweet = objectType({
  name: 'Tweet',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.string('body')
    t.field('author', {
      type: 'User',
      resolve: (parent, _, context: Context) => {
        return context.prisma.tweet
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .author()
      },
    })
    t.list.field('likes', {
      type: 'LikedTweet',
      resolve: (parent, _, context: Context) => {
        return context.prisma.likedTweet.findMany({
          where: { tweedId: parent.id || undefined },
        })
      },
    })
    t.list.field('replies', {
      type: 'Reply',
      resolve: (parent, _, context: Context) => {
        return context.prisma.reply.findMany({
          where: { tweetId: parent.id },
        })
      },
    })
  },
})

const Follow = objectType({
  name: 'Follow',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('followedAt', { type: 'DateTime' })
    t.nonNull.string('target')
    t.nonNull.int('followId')
    t.field('user', {
      type: 'User',
      resolve: (parent, _, ctx: Context) => {
        return ctx.prisma.follow
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .User()
      },
    })
  },
})

const LikedTweet = objectType({
  name: 'LikedTweet',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('likedAt', { type: 'DateTime' })
    t.field('user', {
      type: 'User',
      resolve: (parent, _, context: Context) => {
        return context.prisma.likedTweet
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .User()
      },
    })
    t.field('tweet', {
      type: 'Tweet',
      resolve: (parent, _, context: Context) => {
        return context.prisma.likedTweet
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .tweet()
      },
    })
  },
})

const Reply = objectType({
  name: 'Reply',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.string('body')
    t.field('user', {
      type: 'User',
      resolve: (parent, _, context: Context) => {
        return context.prisma.reply
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .User()
      },
    })
    t.field('tweet', {
      type: 'Tweet',
      resolve: (parent, _, context: Context) => {
        return context.prisma.reply
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .Tweet()
      },
    })
    t.list.field('replies', {
      type: 'Reply',
      resolve: (parent, _, context: Context) => {
        return context.prisma.reply.findMany({
          where: { replyId: parent.id },
        })
      },
    })
  },
})

const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id')
    t.string('email')
  },
})

const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  },
})

const schemaWithoutPermissions = makeSchema({
  types: [
    Query,
    Mutation,
    // Post,
    User,
    Profile,
    AuthPayload,
    UserUniqueInput,
    LikedTweet,
    SortOrder,
    Reply,
    DateTime,
    Tweet,
    Follow,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

export const schema = applyMiddleware(schemaWithoutPermissions, permissions)
