import bcrypt from 'bcrypt'
import { connectDb } from '@/lib/db'
import { User } from '@/model/user';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'

export async function POST(req) {
    await connectDb()
    const {name, email, password} = await req.json();
    const existinguser = await User.findOne({email})
    if(!existinguser){
        return NextResponse.json({error: 'user not found'})
    }
    const verifypassword = await bcrypt.compare(password, existinguser.password);
    if(!verifypassword){
        return NextResponse.json({error: 'your password is wrong'})
    }
    const token = jwt.sign({ name: existinguser.name, email: existinguser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({message: 'login successfull', token})

}