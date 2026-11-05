import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectDB from './db';
import User from '@/models/User';
import { loginSchema } from './validations';
import { rateLimit } from './errors';

export const authOptions = {
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const { email, password } = loginSchema.parse(credentials);
        rateLimit(`login:${email}`, 8, 10 * 60_000);
        await connectDB();
        const user = await User.findOne({ email });
        if (!user?.passwordHash || user.blocked) return null;
        if (!(await bcrypt.compare(password, user.passwordHash))) return null;
        return { id: String(user._id), name: user.name, email: user.email, role: user.role };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })] : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return true;
      await connectDB();
      let u = await User.findOne({ email: user.email.toLowerCase() });
      if (u?.blocked) return false;
      if (!u) u = await User.create({ name: user.name || 'Customer', email: user.email.toLowerCase(), provider: 'google', emailVerified: true });
      user.id = String(u._id); user.role = u.role;
      return true;
    },
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = token.id; session.user.role = token.role; }
      return session;
    },
  },
};
