import { NextResponse } from 'next/server';

export async function POST(request) {
try {
    const { message, history } = await request.json();
    
    // Call your backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/llm/chat`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, history }),
    });
    
    if (!response.ok) {
    throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
} catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
    { error: 'Failed to process request', message: error.message },
    { status: 500 }
    );
}
}