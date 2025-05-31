import QuizPageClient from './QuizPageClient';

type Props = {
  params: { id: string }
}

export default function QuizPageWrapper({ params }: Props) {
  return <QuizPageClient quizId={params.id} />;
}