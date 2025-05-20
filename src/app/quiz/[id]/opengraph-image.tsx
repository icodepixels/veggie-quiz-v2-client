import { ImageResponse } from 'next/og';
import { getQuizById } from '@/app/actions/quizActions';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: { id: string } }) {
  const quiz = await getQuizById(params.id);

  if (!quiz) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 128,
            background: 'white',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Quiz Not Found
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 60,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 40 }}>
          {quiz.name}
        </div>
        <div style={{ fontSize: 40, maxWidth: '80%' }}>
          {quiz.description || 'Test your vegetable knowledge!'}
        </div>
        <div style={{ position: 'absolute', bottom: 50, display: 'flex', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', color: '#388E3C', marginRight: 10 }}>Veggie Quiz</div>
          <div style={{ fontSize: 30 }}>🥕</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}