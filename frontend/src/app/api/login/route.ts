import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the backend server
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();


    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Login failed' },
        { status: response.status }
      );
    }
    

    // Get the token from the response headers
    const cookies = response.headers.get('set-cookie');
    
    // Create a new response with the data
    const nextResponse = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );

    // Forward the cookies from the backend to the frontend
    if (cookies) {
      nextResponse.headers.set('set-cookie', cookies);
    }

    return nextResponse;
  } catch (error: any) {
    console.error('Login error:', error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}