import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Get the token from cookies or authorization header
        const cookieStore = await cookies();
        const tokenFromCookie = cookieStore.get('token')?.value;
        const authHeader = request.headers.get('Authorization');
        const tokenFromHeader = authHeader?.replace('Bearer ', '');

        const token = tokenFromCookie || tokenFromHeader;

        // Forward request to backend
        const response = await fetch(`${BACKEND_URL}/offboarding/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                // Forward cookies for cookie-based auth
                ...(tokenFromCookie && { 'Cookie': `token=${tokenFromCookie}` }),
            },
            body: JSON.stringify(body),
            credentials: 'include',
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || data.error || 'Failed to create offboarding request' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
