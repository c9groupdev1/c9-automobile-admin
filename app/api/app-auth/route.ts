import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as crypto from 'crypto';

const ENCRYPTION_KEY = process.env.SESSION_SECRET || 'c9x-automobile-secret-key-32chars';
const IV_LENGTH = 16;

function encrypt(text: string) {
    if (!text) return '';
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(
            'aes-256-cbc',
            Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
            iv
        );
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (e) {
        return '';
    }
}

/**
 * POST /api/app-auth
 *
 * Called by the React Native WebView before navigating to /account.
 * Accepts { token, user } in the request body, encrypts the token,
 * and sets the HttpOnly c9_session cookie so the middleware passes.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, user } = body;

        if (!token) {
            return NextResponse.json({ message: 'Missing token' }, { status: 400 });
        }

        const encryptedToken = encrypt(token);

        // 7-day session (matches BFF login cookie lifetime)
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();

        const response = NextResponse.json({
            success: true,
            user,
        });

        response.headers.set(
            'Set-Cookie',
            `c9_session=${encryptedToken}; HttpOnly; Path=/; Expires=${expires}; SameSite=Lax`
        );

        return response;
    } catch (err: any) {
        console.error('[app-auth] Failed to set session cookie:', err);
        return NextResponse.json(
            { message: 'Internal error', error: err.message },
            { status: 500 }
        );
    }
}
