import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: 'token is not found' }, { status: 400 });
    }

    // jwt.verify callback based hai, promisify karte hain:
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    return NextResponse.json({ name: decoded.name, email: decoded.email, islogedin: true });

  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
