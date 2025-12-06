import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

type VitalsPayload = {
  name: string;
  value: number;
  id: string;
  path: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType: string;
};

export async function POST(request: NextRequest) {
  try {
    const payload: VitalsPayload = await request.json();

    if (!payload.name || typeof payload.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    logger.info({
      type: 'web-vitals',
      metric: payload.name,
      value: Math.round(payload.value),
      rating: payload.rating,
      path: payload.path,
      id: payload.id,
      navigationType: payload.navigationType,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logger.error({ error, message: 'Failed to process web vitals' });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
