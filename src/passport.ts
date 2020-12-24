import { Request, Response } from 'express'
import passport, { Profile } from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { sendTokenResponse } from '@/lib'
import { prisma } from './prisma'

export function initPassport() {
  passport.serializeUser<any, string>((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser<any, string>((id, done) => {
    prisma.user
      .findUnique({
        where: {
          id,
        },
      })
      .then((user) => {
        done(null, user)
      })
      .catch((error) => {
        console.log(`Error: ${error}`)
      })
  })

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.PUBLIC_URL}/api/v1/auth/google/callback`,
      },
      async(accessToken, refreshToken, profile, cb) => {
        const user = await getUserByProviderProfile(accessToken, refreshToken, profile, 'google')
        cb(null, user)
      },
    ),
  )

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: `${process.env.PUBLIC_URL}/api/v1/auth/twitter/callback`,
        includeEmail: true,
      },
      async(accessToken, refreshToken, profile, cb) => {
        const user = await getUserByProviderProfile(accessToken, refreshToken, profile, 'twitter')
        cb(null, user)
      },
    ),
  )

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.PUBLIC_URL}/api/v1/auth/github/callback`,
      },
      async(accessToken, refreshToken, profile, cb) => {
        const user = await getUserByProviderProfile(accessToken, refreshToken, profile, 'github')
        cb(null, user)
      },
    ),
  )
}

async function getUserByProviderProfile(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  provider: 'github' | 'google' | 'twitter',
) {
  const email = profile.emails[0].value
  const avatar = profile.photos[0].value

  let oauthExisting
  let userExisting

  function createOAuthProfile(userId: string) {
    return prisma.oAuth.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        provider,
        oauthUserId: profile.id,
      },
    })
  }

  // Find one by provider user id
  oauthExisting = await prisma.oAuth.findUnique({
    where: {
      oauthUserId: profile.id,
    },
  })
  if (oauthExisting) {
    userExisting = await prisma.user.findUnique({
      where: {
        id: oauthExisting.userId,
      },
    })
  }

  // Otherwise find one with the same email and link them
  if (!oauthExisting) {
    userExisting = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (userExisting)
      oauthExisting = await createOAuthProfile(userExisting.id)
  }

  // If not found, create user and save oauth user id
  if (!userExisting) {
    userExisting = await prisma.user.create({
      data: {
        email,
        name: profile.displayName || profile.username,
        avatar,
      },
    })
    oauthExisting = await createOAuthProfile(userExisting.id)
  }

  // If avatar changed, update avatar
  if (avatar && userExisting.avatar !== avatar) {
    await prisma.user.update({
      where: {
        id: userExisting.id,
      },
      data: {
        avatar,
      },
    })
  }

  // update token
  if (
    accessToken !== oauthExisting.accessToken
    || refreshToken !== oauthExisting.refreshToken
  ) {
    await prisma.oAuth.update({
      where: {
        id: oauthExisting.id,
      },
      data: {
        accessToken,
        refreshToken,
      },
    })
  }

  return userExisting
}

export { passport }

export async function handleSuccessfulLogin(
  req: Request,
  res: Response,
) {
  const { id } = (req as any).user
  sendTokenResponse(id, res)
}
