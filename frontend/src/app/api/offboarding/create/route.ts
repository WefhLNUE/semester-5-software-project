import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log('🔄 Proxying Offboarding Request to Backend...');

        const response = await fetch('http://localhost:5000/offboarding/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Forward auth token if needed, usually passed in headers
                'Authorization': request.headers.get('Authorization') || '',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Backend returned error:', data);
            return NextResponse.json(data, { status: response.status });
        }

        console.log('✅ Backend success:', data);
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('🔥 Proxy Error:', error);
        return NextResponse.json({ message: 'Internal Proxy Error' }, { status: 500 });
    }
}
