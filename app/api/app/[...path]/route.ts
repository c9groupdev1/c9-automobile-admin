import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as crypto from 'crypto';

const ENCRYPTION_KEY = process.env.SESSION_SECRET || 'c9x-automobile-secret-key-32chars';
const IV_LENGTH = 16;

function encrypt(text: string) {
    if (!text) return '';
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (e) {
        return '';
    }
}

function decrypt(text: string) {
    if (!text) return '';
    try {
        const textParts = text.split(':');
        if (textParts.length !== 2) return '';
        const iv = Buffer.from(textParts.shift()!, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (e) {
        return '';
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handle(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handle(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handle(request, await params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handle(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handle(request, await params);
}

async function handle(request: NextRequest, { path }: { path: string[] }) {
    const secretUrl = process.env.API_SECRET_URL;
    if (!secretUrl) {
        console.error('[BFF ERROR] API_SECRET_URL environment variable is missing!');
        return NextResponse.json({
            message: 'BFF Configuration Error',
            error: 'API_SECRET_URL environment variable is missing'
        }, { status: 500 });
    }
    const cleanSecretUrl = secretUrl.endsWith('/') ? secretUrl.slice(0, -1) : secretUrl;
    
    const pathStr = path.join('/');


    let targetUrl = '';
    
    if (pathStr === 'broadcasting/auth') {
        // Laravel broadcasting auth endpoint is outside the /api route group
        const baseUrl = cleanSecretUrl.endsWith('/api') 
            ? cleanSecretUrl.slice(0, -4) 
            : cleanSecretUrl;
        targetUrl = `${baseUrl}/broadcasting/auth${request.nextUrl.search}`;
    } else {
        targetUrl = `${cleanSecretUrl}/${pathStr}${request.nextUrl.search}`;
    }

    // Set headers
    const headers = new Headers();
    request.headers.forEach((value, key) => {
        // Exclude Host, Connection, and Content-Length to prevent issues on the proxy side
        const lowerKey = key.toLowerCase();
        if (lowerKey !== 'host' && lowerKey !== 'connection' && lowerKey !== 'content-length') {
            headers.set(key, value);
        }
    });

    // Check for authorization cookie first, then fallback to Authorization header
    // Avoid sending Auth header for recommended endpoint since it crashes the backend
    const cookieToken = request.cookies.get('c9_session')?.value || request.cookies.get('token')?.value;
    if (cookieToken && pathStr !== 'listings/recommended') {
        const rawToken = decrypt(cookieToken) || cookieToken; // Fallback to raw if not encrypted (for backward compatibility)
        headers.set('Authorization', `Bearer ${rawToken}`);
    }

    let reqBodyLog: any = null;
    let bodyBuffer: ArrayBuffer | null = null;
    
    // Read the body into an ArrayBuffer
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        try {
            bodyBuffer = await request.arrayBuffer();
            
            const contentType = request.headers.get('content-type') || '';
            if (contentType.includes('application/json') && bodyBuffer.byteLength > 0) {
                try {
                    const textDecoder = new TextDecoder('utf-8');
                    const text = textDecoder.decode(bodyBuffer);
                    reqBodyLog = JSON.parse(text);
                } catch (e) {
                    reqBodyLog = '[Unparsable JSON Request Body]';
                }
            } else {
                reqBodyLog = `[Non-JSON Request Content Type: ${contentType}, length: ${bodyBuffer.byteLength}]`;
            }
        } catch (e) {
            console.error('[BFF ERROR] Failed to read request body:', e);
        }
    }

    console.log(`[BFF REQUEST] ${request.method} -> ${targetUrl}`);
    if (reqBodyLog) {
        console.log(`[BFF REQUEST BODY]`, typeof reqBodyLog === 'object' ? JSON.stringify(reqBodyLog, null, 2) : reqBodyLog);
    }

    try {
        // Construct options for fetch
        const fetchOptions: RequestInit = {
            method: request.method,
            headers,
        };

        // Forward request body if request is not GET or HEAD
        if (request.method !== 'GET' && request.method !== 'HEAD' && bodyBuffer) {
            fetchOptions.body = bodyBuffer;
        }

        const response = await fetch(targetUrl, fetchOptions);

        // Clone response to log JSON payload
        let resBodyLog: any = null;
        const resContentType = response.headers.get('content-type') || '';
        if (resContentType.includes('application/json')) {
            try {
                const clonedRes = response.clone();
                resBodyLog = await clonedRes.json();
            } catch (e) {
                resBodyLog = '[Unparsable JSON Response Body]';
            }
        } else {
            resBodyLog = `[Non-JSON Response Content Type: ${resContentType}]`;
        }

        console.log(`[BFF RESPONSE] Status: ${response.status} from -> ${targetUrl}`);
        if (resBodyLog) {
            console.log(`[BFF RESPONSE BODY]`, typeof resBodyLog === 'object' ? JSON.stringify(resBodyLog, null, 2) : resBodyLog);
        }

        // Clean headers to return to client (prevent transfer-encoding or other issues)
        // Also strip content-encoding — Node's fetch already decompresses gzip/brotli,
        // so forwarding the header causes ERR_CONTENT_DECODING_FAILED in the browser.
        const responseHeaders = new Headers();
        response.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            if (lowerKey !== 'transfer-encoding' && lowerKey !== 'content-encoding') {
                responseHeaders.set(key, value);
            }
        });

        // Intercept login to encrypt the token and set HttpOnly cookie
        if (pathStr === 'users/login' && response.status === 200 && resBodyLog?.token) {
            const rawToken = resBodyLog.token;
            const encryptedToken = encrypt(rawToken);
            
            // Overwrite the token in the response body so frontend doesn't get the raw token
            resBodyLog.token = encryptedToken;
            
            // Set the HttpOnly cookie from the server side
            const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
            responseHeaders.set('Set-Cookie', `c9_session=${encryptedToken}; HttpOnly; Path=/; Expires=${expires}; SameSite=Lax`);
            
            return new Response(JSON.stringify(resBodyLog), {
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders,
            });
        }
        
        // Intercept logout to clear the HttpOnly cookie
        if (pathStr === 'users/logout') {
            responseHeaders.set('Set-Cookie', `c9_session=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`);
            responseHeaders.append('Set-Cookie', `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`);
        }

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });

    } catch (error: any) {
        console.error(`[BFF ERROR] Failed to proxy request to ${targetUrl}:`, error);
        return NextResponse.json({
            message: 'BFF Proxy Error',
            error: error.message || error,
        }, { status: 502 });
    }
}
