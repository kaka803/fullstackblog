import bcrypt from 'bcrypt'
import { connectDb } from '@/lib/db'
import { User } from '@/model/user';
import { NextResponse } from 'next/server';

export async function POST(req) {
     await connectDb()
    const {name, email, password} = await req.json();
    const user = await User.findOne({email})
    if(user){
        return NextResponse.json({error: 'user already exist'}, { status: 400 })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    })
    return NextResponse.json({message: 'user successfully created', newUser} )
}