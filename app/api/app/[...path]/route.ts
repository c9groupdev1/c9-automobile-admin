import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
        // Exclude Host & Connection to prevent issues on the proxy side
        if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'connection') {
            headers.set(key, value);
        }
    });

    // Check for authorization cookie first, then fallback to Authorization header
    const cookieToken = request.cookies.get('token')?.value;
    if (cookieToken) {
        headers.set('Authorization', `Bearer ${cookieToken}`);
    }

    // Clone request for body logging before it gets consumed by fetch stream forwarding
    let reqBodyLog: any = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            try {
                const clonedReq = request.clone();
                reqBodyLog = await clonedReq.json();
            } catch (e) {
                reqBodyLog = '[Unparsable JSON Request Body]';
            }
        } else {
            reqBodyLog = `[Non-JSON Request Content Type: ${contentType}]`;
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

        // Forward request body stream if request is not GET or HEAD
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            fetchOptions.body = request.body;
            // Next.js Route Handlers require duplex to be set when body is a stream
            // @ts-ignore
            fetchOptions.duplex = 'half';
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
        const responseHeaders = new Headers();
        response.headers.forEach((value, key) => {
            if (key.toLowerCase() !== 'transfer-encoding') {
                responseHeaders.set(key, value);
            }
        });

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
